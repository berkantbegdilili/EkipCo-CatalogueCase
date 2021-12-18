import session from 'express-session';
import connectRedis from 'connect-redis';

const RedisStore = connectRedis(session);

const sessionMiddleware = (redisClient) => {
    return session({
        name: "__sid",
        secret: process.env.SESSION_SECRET_KEY,
        store: new RedisStore({
            prefix: 'session:', 
            client: redisClient,
            ttl: 60 * 60 * 1000 
        }),
        resave: false,
        saveUninitialized: true,
        proxy: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000,
            sameSite: 'lax'
        }
    });
};

export default sessionMiddleware;