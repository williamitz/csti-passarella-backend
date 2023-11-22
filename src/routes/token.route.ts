import { Router } from "express";
import { generateTokenMiddleware, verifyMatchToken } from "../middlewares/token.middleware";
import { onGenerateTokenCtrl, onGetCreditCardCtrl } from "../controllers/token.controller";

const tokenRouter = Router();

const _module = '/token';

tokenRouter.post( `${ _module }`, generateTokenMiddleware, onGenerateTokenCtrl );

tokenRouter.get( `${ _module }`, [ verifyMatchToken ], onGetCreditCardCtrl );

export default tokenRouter;

