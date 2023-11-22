import { Router } from "express";
import seederRouter from "./seeder.route";
import tokenRouter from "./token.route";

const rootRouter = Router();

rootRouter.get('/', (req, res) => {
    return res.json({
        api: 'API Passarela backend',
        version: 'v1.0.0',
        path: `${req.protocol}://${req.headers.host}/api/v1`,
        web: process.env.WEB_SITE_APP || 'https://domain.exmple.com',
    });
});

rootRouter.use( seederRouter );
rootRouter.use( tokenRouter );


export default rootRouter;