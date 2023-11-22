import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http, { createServer } from 'http';
import { MORGAN_CONFIG_ACCESS_LOG, PORT, PREFIX_API } from './environments/global.environment';
import { onGetCurrentDate } from './helpers/moment.helper';
import rootRouter from '../routes/root.route';
import { errorHttpHandlerMiddleware, errorRouteNotFound } from '../middlewares/httpErrorHandlerMiddleware';
import { Pool } from 'pg';
import { databaseInstance } from './database';
import { createClient, RedisClientType } from 'redis';


export default class AppServer {

    private static _instance: AppServer;

    public app: express.Application;
    private _httpServer: http.Server;
    private _port: number;
    private _database: Pool;
    redisClient: RedisClientType;

    constructor() {
        this._port = PORT;

        this.app = express();
        this._httpServer = createServer(this.app);
        this._database = databaseInstance;

        this.redisClient = createClient();

        this._onLoadMiddlewares();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private _onLoadMiddlewares() {

        const pathLogs = '../logs';

        if (!fs.existsSync(path.join(__dirname, pathLogs))) {
            fs.mkdirSync(path.join(__dirname, pathLogs));
        }

        const fileAccessLog = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });

        morgan.token('remote-addr', (req) => {
            let ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
            ip = ip.replace(/::ffff:/, '');
            return ip;
        });

        morgan.token('date', (req, res, tz) => onGetCurrentDate(tz as string));

        this.app.use(morgan(MORGAN_CONFIG_ACCESS_LOG, { stream: fileAccessLog }));

        this.app.use(
            cors({
                origin: true, // TODO: ALLOWED_ORIGINS
                credentials: true,
                methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
            })
        );

        this.app.use(helmet());

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        this.app.use(errorHttpHandlerMiddleware);
        
        this.app.get('/', (req, res) => {
            return res.json({
                appName: 'API Passarela backend',
                path: `${req.protocol}://${req.headers.host}/`,
                web: process.env.WEB_SITE_APP || 'https://domain.com',
            });
        });
        
        this.app.use(PREFIX_API, rootRouter);
        
        this.app.use(errorRouteNotFound);
    }

    get db() { return this._database; }

    public onConnectDB(): void {

    }

    public onStart( callback: Function ): void {

        this._httpServer.listen( this._port, callback() );

    }
}
