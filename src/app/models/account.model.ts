import { Client } from "./client.model";

export class Account {
    constructor(
        public id: number,
        public accountNumber: string,
        public type: string,
        public initialBalance: number,
        public state: boolean,
        public client: Client
    ){}
}