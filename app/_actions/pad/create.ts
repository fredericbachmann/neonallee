'use server'

import { authOrRedirect } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'
import { z } from 'zod'
import { etherApiReq } from './utils'
import { revalidatePath } from 'next/cache'

export default async function newPad(padName: string) {
  z.string().parse(padName)

  const session = await authOrRedirect()

  const isAuthor = !!(await prisma.author.findUnique({
    where: {
      id: session.user.id,
    },
  }))
  if (!isAuthor) throw new Error()

  const data = await etherApiReq(
    'createAuthorIfNotExistsFor',
    `authorMapper=${session.user.id}&name=${session.user.name}`
  )
  const author = data.authorID

  const result = await prisma.pad.create({
    data: {
      name: padName,
      members: {
        create: {
          permission: 'OWNER',
          author: {
            connect: {
              id: session.user.id,
            },
          },
        },
      },
    },
    select: {
      id: true,
    },
  })

  const padId = result.id

  await etherApiReq('createPad', `padID=${padId}&authorId=${author}`) // creating a new Pad

  revalidatePath('/user-pads/')
}
