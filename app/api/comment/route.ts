import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/utils/auth'
import prisma from '@/utils/db'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const padId = searchParams.get('padId')
  const comment = searchParams.get('comment')
  if (!padId || !comment) return NextResponse.json({}, { status: 400 })

  const padExistsAndPublished = !!(await prisma.pad.findFirst({
    where: {
      id: padId,
      published: true,
    },
  }))
  if (!padExistsAndPublished) return NextResponse.json({}, { status: 400 })

  const session = await auth()
  if (!session) return NextResponse.json({}, { status: 401 })
  // ------------- quite a few checks above -------------------

  await prisma.comment.create({
    data: {
      text: comment,
      padId: padId,
      userId: session.user.id,
    },
  })

  return NextResponse.json({}, { status: 200 })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({}, { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const commentId = searchParams.get('commentId')
  if (!commentId) return NextResponse.json({}, { status: 400 })

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  })
  if (!comment) return NextResponse.json({}, { status: 400 })

  if (!(comment.userId === session.user.id)) {
    const isAdmin = !!(await prisma.user.findFirst({
      where: {
        id: session.user.id,
        role: 'ADMIN',
      },
    }))
    if (!isAdmin) return NextResponse.json({}, { status: 403 })
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  })

  return NextResponse.json({}, { status: 200 })
}
