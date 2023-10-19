import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/app/db";

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({}, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const commentId = searchParams.get('commentId')
    if (!commentId) return NextResponse.json({}, { status: 400 })

    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    })
    if (!comment) return NextResponse.json({}, { status: 400 })

    if (!(comment.userId === session.user.id)) {
        const isAdmin = !!await prisma.user.findFirst({
            where: {
                id: session.user.id,
                role: 'ADMIN'
            }
        })
        if (!isAdmin) return NextResponse.json({}, { status: 403 })
    }

    await prisma.comment.delete({
        where: {
            id: commentId
        }
    })

    return NextResponse.json({}, { status: 200 })
}