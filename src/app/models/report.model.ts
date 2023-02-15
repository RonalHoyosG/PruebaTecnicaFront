import { Account } from "./account.model";

export class Report {
    constructor(
        public createdAt: string,
        public clientName: string,
        public accountNumber: string,
        public accountType: string,
        public accountInitialBalance: number,
        public transactionState: boolean,
        public transactionValue: number,
        public transactionResidue: number
    ){}
}

export class ReporFilter {
    constructor(
        public startDate: string,
        public endDate: string,
        public clientId: number,
    ){}
}

export class ResponseGetReport {
    constructor(
        public statusCode: number,
        public message: string,
        public data: Report[]
    ){}
}