export class User {
    [x: string]: any;
    constructor(username: string,    password: string) {  this.id++;
    }

    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}
