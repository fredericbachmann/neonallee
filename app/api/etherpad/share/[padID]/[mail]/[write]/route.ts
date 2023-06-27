import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: NextRequest, { params }: {
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
                    user: {
                        email: session.user.email
                    }
                }
            }
        }
    })

    if (!pad) return NextResponse.json({ message: 'Access denied' }, { status: 403 })

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    await prisma.usersOnPads.create({
        data: {
            padId: pad.id,
            userId: user!.id,
            permission: params.write
        }
    })

    return NextResponse.json({ message: 'Success' }, { status: 200 })
}