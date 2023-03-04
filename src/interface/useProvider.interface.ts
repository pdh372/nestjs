export interface ILearnCustomProvide {
    admin: string;
    password: string;
    databaseUrl: string;
}

// Encrypt
export interface IInjectTokenEncrypt {
    key: string;
    iv: string;
}
