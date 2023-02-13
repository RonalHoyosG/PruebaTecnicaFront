import { Account } from "./account.model";

export class Report {
    constructor(
        public date: string,
        public clientId: string,
        public clientName: string,
        public accountId: string,
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
        public clientId: string,
    ){}
}