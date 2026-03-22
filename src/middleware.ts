// ** Next
import {NextRequest, NextResponse} from 'next/server'

// ** Configs
import {VARIABLE} from "@/configs/variable";

const AUTH_PAGES = ['/dang-nhap', '/dang-ky', '/quen-mat-khau']

const PROTECTED_PREFIXES = ['/tai-khoan']

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl

    const refreshToken = request.cookies.get(VARIABLE.REFRESH_TOKEN)?.value
    const hasToken = searchParams.has('token')

    const isLoggedIn = Boolean(refreshToken)

    if (
        hasToken &&
        (pathname.startsWith('/dang-nhap') || pathname.startsWith('/dang-ky'))
    ) {
        return NextResponse.next()
    }

    if (isLoggedIn && AUTH_PAGES.some(path => pathname.startsWith(path))) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (
        !isLoggedIn &&
        PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/'

        return NextResponse.redirect(url)
    }


    return NextResponse.next()
}