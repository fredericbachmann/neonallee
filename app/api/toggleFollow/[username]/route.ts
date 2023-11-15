import { prisma } from "@/app/db"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/utils/auth";

export async function POST(_: NextRequest, { params }: { params: { username: string } }) {
    const session = await auth()

    if (!session) {
        return NextResponse.json({ message: 'Not logged in' }, { status: 401 })
    }

    const following = await prisma.user.findFirst({
        where: {
            id: session.user.id,
            following: {
                some: {
                    username: params.username
                }
            }
        }
    })

    if (!following) {
        await prisma.user.update({
            where: {
                id: session.user.id
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
                id: session.user.id
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