import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: '/pad/:path*'
}

export function middleware(request: NextRequest) {
    const response = NextResponse.next()
    response.cookies.set('prefsHttp', '{}')
    return response
}