import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const requestValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Los campos enviados no son válidos',
      errors: errors.array(),
    });
  }
  next();
};

export default requestValidation;
