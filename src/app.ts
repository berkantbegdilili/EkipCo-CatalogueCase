import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { connect, ConnectOptions, set } from 'mongoose';
import { mongoConnection, redisClient } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import sessionMiddleware from './middlewares/session.middleware';
import pathnameMiddleware from './middlewares/pathname.middleware';
import rateLimiterMiddleware from './middlewares/rate-limiter.middleware';

class App {
    public app: express.Application;
    public port: string | number;
    public env: string;

    constructor(routes: Routes[]) {
        
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.env = process.env.NODE_ENV || 'development';

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.info(`========================================`);
            console.info(`=========== ENV: ${this.env} ===========`);
            console.info(`Catalogue Case is running on port ${this.port}.`);
            console.info(`========================================`);
        });
    }
    
    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        
        this.app.use(helmet());
        this.app.use(
            helmet.permittedCrossDomainPolicies({
              permittedPolicies: "master-only",
            })
        );
        this.app.use(
            helmet.contentSecurityPolicy({
                directives: {
                "default-src": ["'self'"]
                }
            })
        );

        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser(process.env.SESSION_SECRET_KEY));

        this.app.use(sessionMiddleware(redisClient));
        this.app.use(pathnameMiddleware);

        this.app.use(rateLimiterMiddleware);
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
          this.app.use('/', route.router);
        });
    }

    private connectToDatabase() {
        if (this.env !== 'production')
          set('debug', true);
        
        connect(mongoConnection.url, mongoConnection.options as ConnectOptions);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;