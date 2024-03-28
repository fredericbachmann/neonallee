'use server'

import { z } from 'zod'
import { authOrRedirect } from '@/app/_utils/auth'
import { getPadPermission } from '../../../_actions/pad/utils'
import prisma from '@/app/_utils/db'

export default async function getPadMembers(padId: string) {
  z.string().cuid().parse(padId)
  const session = await authOrRedirect()

  const permission = await getPadPermission(padId, session.user.id)
  if (!permission) throw new Error()

  const members = await prisma.authorsOnPads.findMany({
    where: {
      padId: padId,
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

  return members.map((item) => {
    return {
      id: item.author.id,
      username: item.author.username,
      permission: item.permission,
      image: item.author.user.image,
    }
  })
}
