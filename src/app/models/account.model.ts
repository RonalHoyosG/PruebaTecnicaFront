import { Client } from "./client.model";

export class Account {
    constructor(
        public id: number,
        public accountNumber: string,
        public type: string,
        public initialBalance: number,
        public status: boolean,
        public clientId: number
    ){}
}

export class AccountShow {
    constructor(
        public id: number,
        public accountNumber: string,
        public type: string,
        public initialBalance: number,
        public status: boolean,
        public clientId:number,
        public clientName: string,
        public clientIdentification: number,
        public balance: number
    ){}
}