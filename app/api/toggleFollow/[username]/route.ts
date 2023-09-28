import { prisma } from "@/app/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(_: NextRequest, { params }: { params: { username: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: 'Not logged in' }, { status: 401 })
    }

    const following = await prisma.user.findFirst({
        where: {
            AND: [{
                email: session.user.email
            },
            {
                following: {
                    some: {
                        username: params.username
                    }
                }
            }]
        }
    })


    if (!following) {
        await prisma.user.update({
            where: {
                email: session.user.email
            }, data: {
                following: {
                    connect: {
                        username: params.username
                    }
                }
            }
        })
    } else {
        await prisma.user.update({
            where: {
                email: session.user.email
            }, data: {
                following: {
                    disconnect: {
                        username: params.username
                    }
                }
            }
        })
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
}