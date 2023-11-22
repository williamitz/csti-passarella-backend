

import AppServer from "../@core/app-server";
const request = require('supertest');
// import server from '../app';


const server = AppServer.instance;

describe('POST /token', () => {

    
    test( 'should response with a 200 status code', async () => {

        const response = await request( server.app )
        .post('/token')
        .send({
            "email": "lorem@gmail.com",
            "card_number": "4557880595558150",
            "cvv": "123",
            "expiration_year": "2023",
            "expiration_month": "12"
        });

        console.log('response ::: ', response.statusCode );

        expect( response.statusCode ).toBe(200);

    });

});

