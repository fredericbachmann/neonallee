import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/app/db";

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const artistname = searchParams.get('artistname')
    const username = searchParams.get('username')
    if (!artistname || !username) return NextResponse.json({}, { status: 400 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({}, { status: 401 })

    const usernameExists = !!await prisma.author.findUnique({
        where: {
            username: username
        }
    })
    if (usernameExists) {
        return NextResponse.json({ code: 'username-exists' }, { status: 409 })
    }

    await prisma.author.create({
        data: {
            artistname: artistname,
            username: username,
            id: session.user.id
        }
    })

    return NextResponse.json({}, { status: 200 })
}