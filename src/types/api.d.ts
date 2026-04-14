import {TStatus} from "@/types/api.otruyen";

type TGender = 'male' | 'female' | 'lgbt';

type TRole = 'admin' | 'author' | 'user';

type TProvider = 'local' | 'google' | 'facebook';

type TType = 'text' | 'image'

export type NotificationType = 'REPLY_COMMENT' | 'LIKE_COMMENT';

export type AnnouncementType = 'info' | 'warning' | 'maintenance' | 'event';

export type TCountry = 'trung' | 'han' | 'nhat';

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


// Comment
export interface IUserComment {
    _id: string;
    name: string;
    avatar: IImage;
    avatar_frame: IFrame;
}

export interface IReplyTo {
    _id: string;
    name: string
}

export interface IComment {
    _id: string;
    userId: IUserComment;
    comicSlug: string;
    comicName: string;
    chapterId: string;
    chapterName: string;
    replyTo: IReplyTo;
    page: number;
    parent: string;
    content: string;
    likeCount: number;
    replyCount: number;
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
}

export interface IPageOfReply {
    page: number;
}

// Emoji
export interface IEmojiCategory {
    _id: string
    name: string
}

export interface IEmojiCategories extends IEmojiCategory {
    image: IImage;
    order: number;
}


export interface IEmoji {
    _id: string
    name: string
    type: TType
    text?: string
    category: IEmojiCategory
    image?: IImage
    isGif: boolean
}

// ** Notification
export interface INotificationFCM {
    type: NotificationType;
    title: string;
    body: string;
    senderName: string;
    senderAvatar?: string;
    comicSlug: string;
    comicName: string;
    replyId?: string;
    chapterId: string;
    commentId?: string;
    notificationId: string;
}

export interface INotificationMeta {
    senderName: string;
    senderAvatar?: string;
    comicName: string;
    comicSlug: string;
    chapterId?: string;
    contentPreview: string;
}

export interface INotification {
    _id: string;
    recipientId: string;
    senderId: string;
    type: NotificationType;
    commentId: string;
    replyId?: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    meta: INotificationMeta
}

// Announcement
export interface IAnnouncement {
    _id: string;
    title: string;
    content: string;
    type: AnnouncementType;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Comic
export interface IComic {
    _id: string;
    name: string;
    slug: string;
    thumb_url: string;
    authors: string[];
    status: string;
    genres: string[];
    latest_chapter: string;
    chapter_api_data: string;
    updatedAt: string;
    country: TCountry;
    rank: number;
}