import { Request, Response } from "express";
import { registerErrorLogApp } from "../@core/libs/winston.log";
import { messageTypes } from "../@core/interfaces/messageTypes";
import AppServer from "../@core/app-server";
import { QueryResult } from "pg";

export const onRunSeedsCtrl = async ( req: Request, res: Response ) => {
    try {

        const server = AppServer.instance;

        const resolve: QueryResult = await server.db.query(`
            CREATE TABLE creditCards(
                id uuid DEFAULT gen_random_uuid(),
                email text,
                card_number text,
                cvv text,
                expiration_year text,
                expiration_month text,
                idToken text,
                PRIMARY KEY (id)
            );
        `);

        return res.json({
            data: resolve
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