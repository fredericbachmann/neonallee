import { prisma } from "@/app/db";
import { auth } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const padId = searchParams.get('padId')
    if (!padId) return NextResponse.json({ message: 'Wrong parameters' }, { status: 400 })

    const session = await auth()
    if (!session) return NextResponse.json({ message: 'Not logged in' }, { status: 401 })

    const isPadOwner = !!await prisma.author.findFirst({
        where: {
            id: session.user.id,
            pads: {
                some: {
                    permission: 'OWNER',
                    padId: padId
                }
            }
        }
    })
    if (!isPadOwner) return NextResponse.json({ message: 'Not authorized' }, { status: 403 })

    await prisma.padsOnSeries.delete({
        where: {
            padId: padId
        }
    })

    return NextResponse.json({ message: 'Successe' }, { status: 200 })
}