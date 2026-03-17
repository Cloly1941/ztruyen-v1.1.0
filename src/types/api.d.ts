type TGender = 'male' | 'female' | 'lgbt';

type TRole = 'admin' | 'author' | 'user';

type TProvider = 'local' | 'google' | 'facebook';

// Common
interface IImage {
    _id: string;
    url: string;
}

// Auth & User
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
    avatar_frame?: IFrame;
    birthday: string;
    age: number;
    gender: TGender;
    role: TRole;
    provider: TProvider;
    createdAt: string;
    updatedAt: string;
}

export interface IUploadImage {
    _id: string;
    url: string;
}

// Frame
export interface IFrame {
    _id: string;
    name: string;
    image: IImage;
    createdAt: string;
    updatedAt: string;
}

// History
export interface IHistory {
    _id: string
    title: string
    slug: string
    thumb: string
    chapter_id: string
    chapter_name: string
    image_name: number
    path: string
}

// Favorite
export interface IFavorite {
    _id: string
    comic_slug: string
    comic_name: string
    comic_cover: string
    createdAt: string
    updatedAt: string
}

export interface IFavoriteToggle {
    isFavorite: boolean
}