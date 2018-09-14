export class User {
    [x: string]: any;
    constructor(username: string,    password: string) {  this.id++;
    }

    id: number;
    username: string;
    firstName: string;
    lastname: string;
    email: string;
    password: string;

}
