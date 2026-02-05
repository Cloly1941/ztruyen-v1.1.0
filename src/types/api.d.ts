export interface IUserLogin {
    _id: string;
    name: string;
    email: string;
    role?: string;
}

export interface ILogin {
    access_token: string
    user: IUserLogin
}