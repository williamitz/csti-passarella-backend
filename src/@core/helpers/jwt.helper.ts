import jsonWebToken from 'jsonwebtoken';
import { JWT_EXPIRED, JWT_SECRET } from '../environments/global.environment';

/**
 * Función para devolver un token
 * @param payload 
 * @returns token: String
 */
export const generateToken = (payload: any): Promise<string> => {
    return new Promise((resolve, reject) => {

        jsonWebToken.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRED }, (err, token) => {
            if (err) return reject(err);

            resolve(token || '');
        });
    });
};


export const generateRandomString = ( length = 16) => {
      const characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result1 = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result1;
    }
