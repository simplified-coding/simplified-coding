declare module '#auth-utils' {
    interface User {
        identifier: string;
        roles: string[];
    }

    interface UserSession {

    }

    interface SecureSessionData {
        email: string;
    }
}

export {}