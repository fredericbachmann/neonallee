import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getPadPermission } from "@/app/api/etherpad/etherApi"

export async function POST(_: NextRequest, { params }: {
    params: {
        padId: string,
        username: string,
        permission: 'READ' | 'WRITE'
    }
}) {
    const session = await auth()
    if (!session) return NextResponse.json({}, { status: 401 })

    const permission = await getPadPermission(params.padId, session.user.id)
    if (permission !== 'OWNER') return NextResponse.json({}, { status: 403 })

    const author = await prisma.author.findUnique({ // check if the author exists
        where: {
            username: params.username
        }
    })
    if (!author) return NextResponse.json({ message: 'username does not belong to an author' }, { status: 400 })


    await prisma.authorsOnPads.upsert({
        where: {
            authorId_padId: {
                authorId: author.id,
                padId: params.padId
            }
        },
        create: {
            padId: params.padId,
            authorId: author.id,
            permission: params.permission
        },
        update: {
            permission: params.permission
        }
    })

    return NextResponse.json({}, { status: 200 })
}