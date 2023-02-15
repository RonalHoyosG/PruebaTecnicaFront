import { Account } from "./account.model";

export class Transaction {
    constructor(
        public created_at: string,
        public type: string,
        public value: number,
        public status: boolean,
        public account: Account,
        public balance?: number,
        public id?: number
    ) { }
}

export class TransactionsSave {
    constructor(
        public accountId: number,
        public type: string,
        public value: number,
        public status: boolean,
        public id?: number
    ) { }
}

export class TransactionsFilter {
    constructor(
        public filter: string,
        public startDate: string,
        public endDate: string,

    ) { }
}

export class ResponseGetTransactions {
    constructor(
        public statusCode: number,
        public message: string,
        public data: Transaction[]
    ) { }
}