import { Request, Response, NextFunction } from 'express';
import { registerErrorLogApp } from '../@core/libs/winston.log';

class HttpException extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

/**
 *
 * @param error
 * @param request
 * @param response
 * @param next
 */
export const errorHttpHandlerMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || '¡Ups...!,Algo salió mal en el servidor, contactar con el Soporte de la Aplicación';

  registerErrorLogApp(error);

  response.status(status).send({
    message,
  });
};

/**
 *
 * @param req
 * @param res
 */
export const errorRouteNotFound = (req: Request, res: Response) => {
  res.status(404).send({
    error: 404,
    message: `Recurso no encontrado. La URL solicitada ${req.protocol}://${req.headers.host}${req.url} no se encontró en este servidor. Eso es todo lo que sabemos.`,
  });
};
