enum EGender {
    MALE = 'male',
    FEMALE = 'female',
    LGBT = 'lgbt',
}

enum ERole {
    ADMIN = 'admin',
    AUTHOR = 'author',
    USER = 'user',
}

enum EProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
}

interface IImage {
    _id: string;
    url: string;
}

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

export interface IRegister {
    _id: string
    createdAt: string
}

export interface IUserProfile {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    cover?: IImage;
    avatar?: IImage;
    avatar_frame?: IImage;
    birthday: string;
    age: number;
    gender: EGender;
    role: ERole;
    provider: EProvider;
    createdAt: string;
    updatedAt: string;
}