import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'
import { checkInput } from '@/app/_utils/user-input'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const artistname = searchParams.get('artistname')
  const username = searchParams.get('username')
  if (!artistname || !username) return NextResponse.json({}, { status: 400 })
  if (
    !checkInput('username', username).valid ||
    !checkInput('artistname', artistname).valid
  ) {
    return NextResponse.json({}, { status: 400 })
  }

  const session = await auth()
  if (!session) return NextResponse.json({}, { status: 401 })

  const usernameExists = !!(await prisma.author.findUnique({
    where: {
      username: username,
    },
  }))
  if (usernameExists) {
    return NextResponse.json({ code: 'username-taken' }, { status: 409 })
  }

  await prisma.author.create({
    data: {
      artistname: artistname,
      username: username,
      id: session.user.id,
    },
  })

  return NextResponse.json({}, { status: 200 })
}
