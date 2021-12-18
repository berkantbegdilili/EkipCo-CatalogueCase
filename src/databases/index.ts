import IORedis from 'ioredis';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';

export const mongoConnection = {
    url: process.env.DATABASE_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
};

export const redisConnection = {
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    options: {
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (retries) => Math.min(retries * 50, 2000) 
    }
};

export const redisClient = new IORedis(redisConnection.port, redisConnection.host, redisConnection.options);

const rateLimiterMemory = new RateLimiterMemory({
    points: 20,
    duration: 60
});

export const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 100, 
    duration: 60,
    inmemoryBlockOnConsumed: 101,
    inmemoryBlockDuration: 60,
    insuranceLimiter: rateLimiterMemory 
});

export const limiterConsecutiveOutOfLimits = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'consecutiveOutOfLimits',
    points: 99999, 
    duration: 0
});