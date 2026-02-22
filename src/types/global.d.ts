export {};

declare global {

    interface TLink {
        title: string;
        href: string;
    }

    interface TLinkWithIcon extends TLink {
        icon: LucideIcon;
    }

    // api
    interface IApiRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalItems: number;
        },
        result: T[]
    }

    // Otruyen api

    interface ISeoOnPage {
        og_type: string;
        titleHead: string;
        descriptionHead: string;
        og_image: string[];
        og_url: string;
    }


    interface IApiOtruyenRes<T> {
        status: number | string;
        message: string;
        data?: {
            items: T;
            seoOnPage: ISeoOnPage;
        };
    }

    interface IApiOtruyenResDetail<T> {
        status: number | string;
        message: string;
        data?: {
            item: T;
            seoOnPage: ISeoOnPage;
        };
    }

    interface IApiOtruyenResWPagination<T> {
        data?: {
            items: T;
            seoOnPage: ISeoOnPage;
            params: {
                pagination ?: {
                    totalItems: number;
                    totalItemsPerPage: number;
                    currentPage: number;
                    pageRange: number;
                }
            };
            titlePage: string;
        };
    }
}