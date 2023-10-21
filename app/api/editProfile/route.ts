import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/db";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({}, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const fieldToChange = searchParams.get('field')
    const newValue = searchParams.get('value')
    if (!fieldToChange || !newValue) return NextResponse.json({}, { status: 400 })

    if (['name', 'city', 'email'].includes(fieldToChange)) {
        if (fieldToChange === 'email') {
            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    emailVerified: undefined
                }
            })
        }

        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                [fieldToChange]: newValue
            }
        })
        return NextResponse.json({}, { status: 200 })
    }

    if (['username', 'artistname', 'about'].includes(fieldToChange)) {
        const isAuthor = !!await prisma.author.findUnique({
            where: {
                id: session.user.id
            }
        })
        if (!isAuthor) return NextResponse.json({}, { status: 400 })

        if (fieldToChange === 'username') {
            const usernameExists = !!await prisma.author.findUnique({
                where: {
                    username: newValue
                }
            })
            if (usernameExists) return NextResponse.json({ code: 'username-exists' }, { status: 409 })
        }

        await prisma.author.update({
            where: {
                id: session.user.id
            },
            data: {
                [fieldToChange]: newValue
            }
        })
        return NextResponse.json({}, { status: 200 })
    }

}