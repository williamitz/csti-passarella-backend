import { Router } from "express";
import { onRunSeedsCtrl } from "../controllers/seeder.controller";

const seederRouter = Router();

const _module = '/seed';

seederRouter.get( `${ _module }`, [], onRunSeedsCtrl )


export default seederRouter;
