import winston from "winston";
import fs from 'fs';
import path from 'path';
import { APP_MODE } from "../environments/global.environment";



const errorFilePath = path.resolve(__dirname, '../logs/errors.log');

const stream = fs.createWriteStream(errorFilePath);

const logger = winston.createLogger({
    transports: [new winston.transports.Stream({ stream })],
});

export const registerErrorLogApp = (error: any) => {
    if (APP_MODE !== 'production') {
        console.log(error);
    }

    logger.log({ level: 'error', message: JSON.stringify(error, null, 2) });

    // setTimeout(() => {
    //   try {
    //     fs.unlinkSync(errorFilePath);
    //   } catch (ex) {
    //     console.log('Error al eliminar error.log');
    //   }
    // }, 3.6e6);
};