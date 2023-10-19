import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/app/db";

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const padId = searchParams.get('padId')
    const comment = searchParams.get('comment')
    if (!padId || !comment) return NextResponse.json({}, { status: 400 })

    const padExistsAndPublished = !!await prisma.pad.findFirst({
        where: {
            id: padId,
            published: true
        }
    })
    if (!padExistsAndPublished) return NextResponse.json({}, { status: 400 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({}, { status: 401 })
    // ------------- quite a few checks above -------------------

    await prisma.comment.create({
        data: {
            text: comment,
            padId: padId,
            userId: session.user.id
        }
    })

    return NextResponse.json({}, { status: 200 })
}