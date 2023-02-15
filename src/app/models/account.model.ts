import { Client } from "./client.model";

export class Account {
    
    constructor(
        public accountNumber: string,
        public type: string,
        public initialBalance: number,
        public status: boolean,
        public client: Client,
        public id?: number,
        public currentBalance?: number
    ) { }
}

export class AccountSave {
    constructor(
        public accountNumber: string,
        public type: string,
        public initialBalance: number,
        public status: boolean,
        public clientId: number,
        public id?: number,
    ) { }
}

export class AccountShow {
    constructor(
        public id: number,
        public accountNumber: string,
        public type: string,
        public initialBalance: number,
        public status: boolean,
        public clientId: number,
        public clientName: string,
        public clientIdentification: number,
        public balance: number
    ) { }

}

export class ResponseGetAccount {
    constructor(
        public statusCode: number,
        public message: string,
        public data: Account[]
    ) { }
}