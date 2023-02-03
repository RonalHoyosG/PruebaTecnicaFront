import { Account } from "./account.model";

export class Transactions {
    constructor(
        public id: number,
        public date: string,
        public type: string,
        public value: number,
        public residue: number,
        public state: number,
        public account: Account
    ){}
}