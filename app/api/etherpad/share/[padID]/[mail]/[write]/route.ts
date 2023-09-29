import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(_: NextRequest, { params }: {
    params: {
        padID: string,
        mail: string,
        write: 'READ' | 'WRITE'
    }
}) {

    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: 'Invalid login' }, { status: 401 })
    }

    const pad = await prisma.pad.findFirst({ // find the pad for the given ID (if user has access)
        where: {
            id: params.padID,
            members: {
                some: {
                    permission: "OWNER",
                    author: {
                        user: {
                            email: session.user.email
                        }
                    }
                }
            }
        }
    })
    if (!pad) return NextResponse.json({ message: 'Access denied' }, { status: 403 })


    const isAuthor: boolean = !!await prisma.author.findFirst({ // check if user to be included is an author
        where: {
            user: {
                email: params.mail
            }
        }
    })
    if (!isAuthor) return NextResponse.json({ message: 'given email does not belong to an author' }, { status: 400 })


    const user = await prisma.user.findUnique({
        where: {
            email: params.mail
        }
    })

    await prisma.authorsOnPads.upsert({
        where: {
            authorId_padId: {
                authorId: user!.id,
                padId: pad.id
            }
        },
        create: {
            padId: pad.id,
            authorId: user!.id,
            permission: params.write
        },
        update: {
            permission: params.write
        }
    })

    return NextResponse.json({ message: 'Success' }, { status: 200 })
}