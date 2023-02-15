import { Person } from "./person.model";

export class Client {
    constructor(
        public password: string,
        public status: boolean,
        public person: Person,
        public id?: number,
    ){}
}

export class ResponseGetClient {
    constructor(
        public statusCode: number,
        public message: string,
        public data: Client[]
    ){}
}