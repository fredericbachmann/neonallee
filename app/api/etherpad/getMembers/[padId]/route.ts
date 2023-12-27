import { getPadPermission } from '@/app/api/etherpad/etherApi'
import prisma from '@/app/db'
import { auth } from '@/utils/auth'
import { NextResponse } from 'next/server'

export async function GET(
  _: Request,
  { params }: { params: { padId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({}, { status: 401 })

  const permission = await getPadPermission(params.padId, session.user.id)
  if (!permission) return NextResponse.json({}, { status: 403 })

  const members = await prisma.authorsOnPads.findMany({
    where: {
      padId: params.padId,
    },
    select: {
      permission: true,
      author: {
        select: {
          id: true,
          username: true,
          user: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  })

  const flattenedMembers = members.map((item) => {
    return {
      id: item.author.id,
      username: item.author.username,
      permission: item.permission,
      image: item.author.user.image,
    }
  })

  return NextResponse.json({ members: flattenedMembers }, { status: 200 })
}
