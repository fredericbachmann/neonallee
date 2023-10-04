import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPadPermission } from "@/app/api/etherpad/etherApi";
import { prisma } from "@/app/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { padID: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({}, { status: 401 })

    const permission = await getPadPermission(params.padID, session.user.id)
    if (!permission) return NextResponse.json({}, { status: 403 })

    const members = await prisma.authorsOnPads.findMany({
        where: {
            padId: params.padID
        },
        select: {
            permission: true,
            author: {
                select: {
                    id: true,
                    username: true,
                    user: {
                        select: {
                            image: true
                        }
                    }
                }
            }
        }
    })

    const flattenedMembers = members.map(item => {
        return {
            username: item.author.username,
            permission: item.permission,
            image: item.author.user.image
        }
    })

    return NextResponse.json({ members: flattenedMembers }, { status: 200 })
}