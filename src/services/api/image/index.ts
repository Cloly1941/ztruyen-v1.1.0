// ** lib
import {authFetcherWithRefresh} from "@/lib/auth-fetch";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import {IUploadImage} from "@/types/api";

// ** Module type
export type TFormUploadAvatarPayload = {
    file: File;
    caption: string;
}

export const ImageService = {
    upload: (payload: TFormUploadAvatarPayload): Promise<IApiRes<IUploadImage>> => {

        const formData = new FormData()
        formData.append("file", payload.file)
        formData.append("caption", payload.caption)

        return authFetcherWithRefresh<IApiRes<IUploadImage>>(CONFIG_API.IMAGE.UPLOAD, {
            method: 'POST',
            body: formData,
        });
    }
}