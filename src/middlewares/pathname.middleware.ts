import { User } from '@/interfaces/user.interface';
import { NextFunction, Request, Response } from 'express';
import parseurl from 'parseurl';

declare module 'express-session' {
    interface SessionData {
      views: any;
      ip: string;
      user: User;
    }
}

const pathnameMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.views) 
        req.session.views = {};
    
    var pathname = parseurl(req).pathname;
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
    req.session.ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    
    next();
};

export default pathnameMiddleware;