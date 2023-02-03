import { Person } from "./person.model";

export class Client {
    constructor(
        public id: number,
        public password: string,
        public status: boolean,
        public person: Person
    ){}
}