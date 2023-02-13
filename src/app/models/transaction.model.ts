import { Account } from "./account.model";

export class Transactions {
    constructor(
        public id: number,
        public date: string,
        public type: string,
        public accountId: number,
        public value: number,
        public residue: number,
        public status: boolean,
        
    ){}
}

export class TransactionsShow {
    constructor(
        public id: number,
        public date: string,
        public type: string,
        public accountId: number,
        public accountNumber: Number,
        public value: number,
        public residue: number,
        public status: boolean,
        public clientName: string,
        public clientIdentification: number
    ){}
}

export class TransactionsFilter {
    constructor(
        public filter: string,
        public startDate: string,
        public endDate: string,
        
    ){}
}