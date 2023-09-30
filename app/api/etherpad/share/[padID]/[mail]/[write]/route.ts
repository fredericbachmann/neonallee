import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(_: NextRequest, { params }: {
    params: {
        padID: string,
        username: string,
        permission: 'READ' | 'WRITE'
    }
}) {

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: 'Invalid login' }, { status: 401 })
    }

    const pad = await prisma.pad.findFirst({ // find the pad for the given ID (if user has access)
        where: {
            id: params.padID,
            members: {
                some: {
                    permission: "OWNER",
                    author: {
                        id: session.user.id
                    }
                }
            }
        }
    })
    if (!pad) return NextResponse.json({ message: 'Access denied' }, { status: 403 })


    const authorExists: boolean = !!await prisma.author.findUnique({ // check if the author exists
        where: {
            username: params.username
        }
    })
    if (!authorExists) return NextResponse.json({ message: 'username does not belong to an author' }, { status: 400 })


    await prisma.authorsOnPads.upsert({
        where: {
            authorId_padId: {
                authorId: session.user.id,
                padId: pad.id
            }
        },
        create: {
            padId: pad.id,
            authorId: session.user.id,
            permission: params.permission
        },
        update: {
            permission: params.permission
        }
    })

    return NextResponse.json({ message: 'Success' }, { status: 200 })
}