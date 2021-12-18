import { NextFunction, Request, Response } from 'express';
import { HttpErrorException } from '@/exceptions/http-error.exception';
import { rateLimiter, limiterConsecutiveOutOfLimits } from '@databases';

const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.session.ip;
    const resById = await rateLimiter.get(key);

    let retrySecs = 0;

    if (resById !== null && resById.remainingPoints <= 0) {
        retrySecs = Math.round(resById.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set('X-BB-RETRY-AFTER', String(retrySecs));

        throw new HttpErrorException(429, 'You sent too many requests. Your access is restricted.');
    } else {
        try {
        const resConsume = await rateLimiter.consume(key);

        const headers = {
            "X-BB-USED-IP-1M": resConsume.consumedPoints,
            "X-BB-RESET-TIME": new Date(Date.now() + resConsume.msBeforeNext)
        };

        res.set(headers);

        if (resConsume.remainingPoints <= 0) {
            const resPenalty = await limiterConsecutiveOutOfLimits.penalty(key);
            await rateLimiter.block(key, 60 * getFibonacciBlockDurationMinutes(resPenalty.consumedPoints));
        }

        next();
        } catch (rlRejected) {
            if (rlRejected instanceof Error) {
                throw rlRejected;
            } else {
                res.set('X-BB-RETRY-AFTER', String(retrySecs));

                throw new HttpErrorException(429, 'You sent too many requests. Your access is restricted.');
            }
        }
    }
}

const getFibonacciBlockDurationMinutes = (countConsecutiveOutOfLimits) => {
    if (countConsecutiveOutOfLimits <= 1) 
        return 1;
    
    return getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 1) + getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 2);
}

export default rateLimiterMiddleware;