import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: '/user-pads/pad/:path*'
}

// for some reason etherpad will only work if the cookie is set...
export function middleware() {
    const response = NextResponse.next()
    response.cookies.set('prefsHttp', '{}')
    return response
}