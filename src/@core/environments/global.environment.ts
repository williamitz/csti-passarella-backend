export const PORT = Number(process.env.PORT) || 3000;
export const TIME_ZONE_VALID = [
    'America/Lima', 
    'America/Guayaquil', 
    'America/Santiago', 
    'America/Bogota', 
    'America/La_Paz', 
    'America/Caracas'
];

export const APP_MODE = process.env.APP_MODE || 'development';
export const PREFIX_API = process.env.PREFIX_API || '/api/v1';
export const JWT_SECRET = process.env.JWT_SECRET || 'MySecretKey';
export const JWT_EXPIRED = process.env.JWT_EXPIRED || '15m';

export const MORGAN_CONFIG_ACCESS_LOG = process.env.MORGAN_CONFIG_ACCESS_LOG || ':method :url :status :res[content-length] - :response-time ms';