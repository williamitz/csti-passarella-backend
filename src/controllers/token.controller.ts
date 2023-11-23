import { Request, Response } from "express";
import { registerErrorLogApp } from "../@core/libs/winston.log";
import { messageTypes } from "../@core/interfaces/messageTypes";
import { IBodyCard, ICreditCard, IRequestAuth } from "../@core/interfaces/token.interface";
import AppServer from "../@core/app-server";
import { QueryResult } from "pg";
import { generateRandomString, generateToken } from "../@core/helpers/jwt.helper";


export const onGenerateTokenCtrl = async ( req: Request, res: Response ) => {
    try {
        
        const { email, card_number, cvv, expiration_month, expiration_year } = req.body as IBodyCard;
        
        const appServer = AppServer.instance;

        const fCardExists: QueryResult<ICreditCard> = await appServer.db.query(`
            SELECT * FROM creditCards WHERE card_number = $1
        `, [ card_number ]);
        

        let token = '';
        let idToken = generateRandomString();
        idToken = idToken.replace(' ', '');

        if( fCardExists.rowCount == 0 ) {

            // crear registro

            const newCard: QueryResult<ICreditCard> = await appServer.db.query(`
                INSERT INTO creditCards( 
                    email,
                    card_number,
                    cvv,
                    expiration_year,
                    expiration_month,
                    idToken )
                VALUES(
                    '${ email }',
                    '${ card_number }',
                    '${ cvv }',
                    '${ expiration_year }',
                    '${ expiration_month }',
                    '${ idToken }'
                ) RETURNING *;
            `);

            const newRecord = newCard.rows[0];

            token = await generateToken({ id: newRecord.id });

            await appServer.redisClient.setEx( idToken, 900, JSON.stringify({ ...newRecord, token }) );

        } else {

            // extraer id y generar nuevo TOKEN

            const cardFind = fCardExists.rows[0];

            const cardUpdate: QueryResult<ICreditCard> = await appServer.db.query(`
                UPDATE creditCards
                SET idToken = '${ idToken }'
                WHERE id = '${ cardFind.id }'
                RETURNING *;
            `)

            const newRecord = cardUpdate.rows[0];

            token = await generateToken({ id: newRecord.id });

            await appServer.redisClient.setEx( idToken, 900, JSON.stringify({ ...newRecord, token }) );

        }

        return res.json({
            ok: true,
            message: 'successfuly',
            token: idToken
        });
        
    } catch (error) {
        registerErrorLogApp(error);

        return res.status(400).json({
            ok: false,
            error: {
                message: messageTypes.errorMessageBadRequest,
                error,
            },
        });
    }
}

export const onGetCreditCardCtrl = async ( req: Request, res: Response ) => {

    try {

        const httpRequest = req as any as IRequestAuth;
        
        const { creditCard } = httpRequest;

        const { cvv, idtoken, ...data } = creditCard;

        return res.json({
            ok: true,
            message: 'successfuly',
            data
        });
        
    } catch (error) {
        
        registerErrorLogApp(error);

        return res.status(400).json({
            ok: false,
            error: {
                message: messageTypes.errorMessageBadRequest,
                error,
            },
        });

    }

}