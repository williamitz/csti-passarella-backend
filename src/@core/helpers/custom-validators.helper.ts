import { onGetCurrentYear } from "./moment.helper";

export const onVerifyLuhn  = (number: string) => {

    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(number)) throw new Error('número de tarjeta inválido');

    const isValid = number.split('')
    .reduce( (sum, d: any, n) => {
        return sum + parseInt(((n + number.length) %2)? d: [0,2,4,6,8,1,3,5,7,9][d]); 
    }, 0 ) % 10 == 0;

    console.log('isValid ::: ', isValid);

    if( !isValid ) return false;

    return true;

}


