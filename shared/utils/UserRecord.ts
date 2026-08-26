export default class UserRecord {
    email: string;
    roles: string[];


    constructor(email: string) {
        this.email = email;
        this.roles = [];
    }
}