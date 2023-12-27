import { auth } from '@/utils/auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/db'
import { checkInput } from '@/app/user-input'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({}, { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const fieldToChange = searchParams.get('field')
  const newValue = searchParams.get('value')
  if (
    !(
      fieldToChange &&
      newValue &&
      ['name', 'city', 'email', 'username', 'artistname', 'about'].includes(
        fieldToChange
      )
    )
  )
    return NextResponse.json({}, { status: 400 })

  if (
    !checkInput(
      fieldToChange as
        | 'name'
        | 'city'
        | 'email'
        | 'username'
        | 'artistname'
        | 'about',
      newValue
    )
  ) {
    return NextResponse.json({}, { status: 400 })
  }

  if (['name', 'city', 'email'].includes(fieldToChange)) {
    if (fieldToChange === 'email') {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          emailVerified: undefined,
        },
      })
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [fieldToChange]: newValue,
      },
    })
    return NextResponse.json({}, { status: 200 })
  }

  if (['username', 'artistname', 'about'].includes(fieldToChange)) {
    const isAuthor = !!(await prisma.author.findUnique({
      where: {
        id: session.user.id,
      },
    }))
    if (!isAuthor) return NextResponse.json({}, { status: 400 })

    if (fieldToChange === 'username') {
      const userWithUsername = await prisma.author.findUnique({
        where: {
          username: newValue,
        },
      })
      if (userWithUsername && userWithUsername.id !== session.user.id) {
        return NextResponse.json({ code: 'username-taken' }, { status: 409 })
      }
    }

    await prisma.author.update({
      where: {
        id: session.user.id,
      },
      data: {
        [fieldToChange]: newValue,
      },
    })
    return NextResponse.json({}, { status: 200 })
  }
}
