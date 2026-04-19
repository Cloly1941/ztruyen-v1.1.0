// ** Next
import {headers} from "next/headers";
import {redirect} from "next/navigation";

// ** Config
import {VARIABLE} from "@/configs/variable";

export default async function DeviceRedirect() {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";

    const isIphone = /iPhone/i.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

    if (isIphone || isSafari) {
        redirect(`${VARIABLE.BASE_URL_FE}/huong-dan`);
    }

    return null;
}