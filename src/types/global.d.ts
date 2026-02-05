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
}