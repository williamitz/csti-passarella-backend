export interface IBodyCard {
    email:       string;
    card_number: string;
    cvv:         string;
    expiration_year: string;
    expiration_month: string;
}

export interface ICreditCard {
    id: string;
    email: string;
    card_number: string;
    cvv: string;
    expiration_year: string;
    expiration_month: string;
    idtoken?: string;
    token?: string;
}

export interface PayloadJWTokenType {
    id: string;
}

export interface IRequestAuth {
    creditCard: ICreditCard;
}