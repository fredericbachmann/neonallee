import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/app/db';

/** Creates a new Series */
export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name')
    if (!name) return NextResponse.json({ message: 'Wrong parameter format' }, { status: 400 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: 'Not logged in' }, { status: 401 })

    const isAuthor = !!await prisma.author.findUnique({
        where: { id: session.user.id }
    })
    if (!isAuthor) return NextResponse.json({ message: 'Only Available for authors' }, { status: 403 })


    await prisma.series.create({
        data: {
            name: name,
            ownerId: session.user.id
        }
    })

    return NextResponse.json({ message: 'Success' }, { status: 200 })
}

/** Toggles wheather the pad belongs to the series */
export async function PATCH(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const seriesId = searchParams.get('seriesId')
    const padId = searchParams.get('padId')
    if (!seriesId || !padId) return NextResponse.json({ message: 'Wrong parameter format' }, { status: 400 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: 'Not logged in' }, { status: 401 })

    const isAuthor = !!await prisma.author.findUnique({
        where: { id: session.user.id }
    })
    if (!isAuthor) return NextResponse.json({ message: 'Only Available for authors' }, { status: 403 })

    const isSeriesOwner = !!await prisma.series.findFirst({
        where: {
            id: seriesId,
            ownerId: session.user.id
        }
    })
    if (!isSeriesOwner) return NextResponse.json({ message: 'Not the owner of the series' }, { status: 403 })

    const isPadOwner = !!await prisma.authorsOnPads.findFirst({
        where: {
            authorId: session.user.id,
            padId: padId,
            permission: 'OWNER'
        }
    })
    if (!isPadOwner) return NextResponse.json({ message: 'Not the owner of the pad' }, { status: 403 })

    const result = await prisma.series.update({
        where: {
            id: seriesId,
        },
        data: {
            pads: {
                connect: {
                    padId: padId
                }
            }
        }
    })
    console.log(result)

    return NextResponse.json({ message: 'Success' }, { status: 200 })
}