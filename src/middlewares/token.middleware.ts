import { body } from "express-validator";
import { cvvPatt, emailPatt } from "../@core/helpers/regexp.helper";
import { onVerifyLuhn } from "../@core/helpers/custom-validators.helper";
import requestValidation from "../@core/validations/requestValidation";
import { onGetCurrentYear } from "../@core/helpers/moment.helper";
import { messageTypes } from "../@core/interfaces/messageTypes";
import jsonWebToken from 'jsonwebtoken';
import { JWT_SECRET } from "../@core/environments/global.environment";
import AppServer from "../@core/app-server";
import { ICreditCard, PayloadJWTokenType } from "../@core/interfaces/token.interface";
import { NextFunction, Request, Response } from "express";
import { registerErrorLogApp } from "../@core/libs/winston.log";
import { QueryResult } from "pg";

const _current = onGetCurrentYear();


/**
 * Middleware para extraer y válidar token
 * @param reqExpress
 * @param res
 * @param next
 * @returns
 */
export const verifyMatchToken = async (reqExpress: Request, res: Response, next: NextFunction) => {
    const req = reqExpress as any;
    const { authorization = undefined } = req.headers;
    try {

        if (!authorization) {
            throw new Error(messageTypes.tokenNotExist);
        }

        let arrayAuthorization = authorization.split(' ');

        let token = arrayAuthorization[1];

        if (!token) {
            throw new Error(messageTypes.tokenNotExist);
        }

        const appServer = AppServer.instance;

        const redisRecord = await appServer.redisClient.get( token );

        if( !redisRecord ) {
            throw new Error(messageTypes.tokenNotExist);
        }

        const creditCardRedis: ICreditCard = JSON.parse( redisRecord );

        const payload = jsonWebToken.verify( creditCardRedis.token!, JWT_SECRET );

        const { id } = <PayloadJWTokenType>payload;

        const creditCards: QueryResult<ICreditCard> = await appServer.db.query(`
            SELECT * FROM creditCards 
            WHERE id = $1;
        `, [ id ]);

        const creditCard = creditCards.rows[0];

        if (!creditCard ) {
            return res.status(401).json({
                message: messageTypes.userBlocked,
            });
        }

        req.creditCard = {...creditCard};

        next();

    } catch (error) {
        registerErrorLogApp(`${messageTypes.tokenExpired} :: Auth Dashboard, IP Client  ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);

        return res.status(401).json({
            message: messageTypes.tokenExpired,
        });
    }
};

export const generateTokenMiddleware = [

    body('email')
        .not().isEmpty()
        .matches( emailPatt ).withMessage('Por favor ingrese un email válido hola@domain.com')
        .isLength({ min: 5, max: 100 }).withMessage('Email entre 5 a 100 caracteres'),
    
    body('card_number')
        .not().isEmpty()
        .custom( onVerifyLuhn ).withMessage('Este número de tarjeta no es válido')
        .isLength({ min: 13, max: 16 }).withMessage('Tarjeta entre 13 a 16 caracteres'),

    body('cvv', 'Cvv inválido')
        .not().isEmpty()
        .matches( cvvPatt ).withMessage('Por favor ingrese cvv válido 000'),

    body('expiration_year')
        .not().isEmpty()
        .isInt({ min: _current, max: ( _current + 5) }).withMessage('Año de expiración inválido')
        .isLength({ min: 4, max: 4 }).withMessage('Año de expiracion debe tener 4 caracteres'),    

    body('expiration_month')
        .not().isEmpty()
        .isLength({ min: 1, max: 2 }).withMessage('Mes de expiracion debe tener entre 1 o 2 caracteres')
        .isInt({ min: 1, max: 12 }),


    requestValidation
];