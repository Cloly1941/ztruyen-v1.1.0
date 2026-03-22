// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import {IComment} from "@/types/api";

// ** Util and type
import {buildQueryString, TQueryParams} from "@/utils/buildQueryString";

// ** Types
import {TSendCommentPayload, TSendReplyPayload} from "@/modules/truyen-tranh/Comment/SendComment";
import {TFormReportCommentPayload} from "@/modules/truyen-tranh/Comment/FormReportComment";

export const CommentService = {
    list: (params: TQueryParams): Promise<IApiRes<IModelPaginateComment<IComment>>> => {
        const query = buildQueryString(params)
        return authFetcherWithRefresh<IApiRes<IModelPaginateComment<IComment>>>(
            `${CONFIG_API.COMMENT.INDEX}?${query}`
        )
    },
    create: (payload: TSendCommentPayload): Promise<IApiRes<void>> => {
        return authFetcherWithRefresh<IApiRes<void>>(CONFIG_API.COMMENT.INDEX, {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
    listReplies: (id: string, params: TQueryParams): Promise<IApiRes<IModelPaginate<IComment>>> => {
        const query = buildQueryString(params)
        return authFetcherWithRefresh<IApiRes<IModelPaginate<IComment>>>(
            `${CONFIG_API.COMMENT.REPLIES}/${id}?${query}`
        )
    },
    createReply: (payload: TSendReplyPayload): Promise<IApiRes<void>> => {
        return authFetcherWithRefresh<IApiRes<void>>(CONFIG_API.COMMENT.REPLY, {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
    toggleLike: (id: string): Promise<IApiRes<void>> => {
        return authFetcherWithRefresh<IApiRes<void>>(CONFIG_API.COMMENT.LIKE, {
            method: 'POST',
            body: JSON.stringify({commentId: id}),
        })
    },
    delete: (id: string): Promise<IApiRes<void>> => {
        return authFetcherWithRefresh<IApiRes<void>>(`${CONFIG_API.COMMENT.INDEX}/${id}`, {
            method: 'DELETE'
        })
    },
    report: (payload: TFormReportCommentPayload): Promise<IApiRes<void>> => {
        return authFetcherWithRefresh<IApiRes<void>>(CONFIG_API.COMMENT.REPORT, {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
}