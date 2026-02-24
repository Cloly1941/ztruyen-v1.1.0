type TOtruyenCategory = {
    _id: string;
    name: string;
    slug: string;
}

type TStatus = 'ongoing' | 'coming_soon' | 'completed';

type TOtruyenChapterLatest = {
    filename: string;
    chapter_name: string;
    chapter_title: string;
    chapter_api_data: string;
}

export interface IOtruyenListComic {
    _id: string;
    name: string;
    slug: string;
    origin_name: string[];
    status: TStatus;
    thumb_url: string;
    sub_docquyen: boolean;
    category: TOtruyenCategory[];
    updatedAt: string;
    chaptersLatest: TOtruyenChapterLatest[];
}

export interface IOtruyenListGenre {
    _id: string;
    name: string;
    slug: string;
}

// Detail Comic
type TOtruyenChapter = {
    filename: string;
    chapter_name: string;
    chapter_title: string;
    chapter_api_data: string;
};

type TOtruyenChapterServer = {
    server_name?: string;
    server_data?: TOtruyenChapter[];
};

// Chapter
type TOtruyenChapterImage = {
    image_page: number;
    image_file: string;
}

export interface IOtruyenDetailComic {
    _id: string;
    name: string;
    slug: string;
    origin_name: string[];
    content: string;
    status: TStatus
    thumb_url: string;
    sub_docquyen: boolean;
    author: string[];
    category: TOtruyenCategory[];
    chapters: TOtruyenChapterServer[]
}

export interface IOtruyenSearchComic {
    name: string;
    slug: string;
    status: TStatus
    thumb_url: string;
    author: string[];
    category: TOtruyenCategory[];
    chapters: TOtruyenChapterServer[]
    updatedAt: string;
    chaptersLatest: TOtruyenChapterLatest[];
}

export interface IOTruyenChapter {
    _id: string;
    comic_name: string;
    chapter_name: string;
    chapter_path: string;
    chapter_image: TOtruyenChapterImage[];
}
