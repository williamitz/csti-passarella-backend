import colors from 'colors';
// import server from './app';
import { PORT } from './@core/environments/global.environment';
import AppServer from "./@core/app-server";

console.clear();

const server = AppServer.instance;

server.onStart( async (error: any) => {

    if( error ) {
        console.log( colors.red( 'Error al correr el servidor' ), '🚨' )
    }
    
    console.log( colors.green( 'Servidor corriendo en puerto: ' ), PORT );
    
    server.redisClient.connect()
    .then( (resolve) => {
        console.log( colors.green('redis online ... ') );
    } )
    .catch( (e) => console.log );

} );