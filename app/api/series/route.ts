import { auth } from "@/utils/auth";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/db';

/** Creates a new Series */
export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name')
    if (!name) return NextResponse.json({ message: 'Wrong parameter format' }, { status: 400 })

    const session = await auth()
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

/** Adds a pad to the series */
export async function PATCH(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const seriesId = searchParams.get('seriesId')
    const padId = searchParams.get('padId')
    if (!seriesId || !padId) return NextResponse.json({ message: 'Wrong parameter format' }, { status: 400 })

    const session = await auth()
    if (!session) return NextResponse.json({ message: 'Not logged in' }, { status: 401 })

    const isPadAndSeriesOwner = !!await prisma.author.findFirst({
        where: {
            id: session.user.id,
            ownedSeries: {
                some: { id: seriesId }
            },
            pads: {
                some: {
                    permission: 'OWNER',
                    padId: padId
                }
            }
        }
    })
    if (!isPadAndSeriesOwner) return NextResponse.json({ message: 'Not authorized' }, { status: 403 })

    const indexResult = await prisma.padsOnSeries.findMany({
        where: {
            seriesId: seriesId
        },
        orderBy: { indexInSeries: 'desc' }
    })
    const lastIndex = indexResult.length > 0 ? indexResult[0].indexInSeries : 0

    const result = await prisma.padsOnSeries.create({
        data: {
            padId: padId,
            seriesId: seriesId,
            indexInSeries: lastIndex + 1
        }
    })
    if (!result) return NextResponse.json({ message: 'Unexpected error' }, { status: 500 })

    return NextResponse.json({ message: 'Success' }, { status: 200 })
}