'use server'

import { z } from 'zod'
import { writeCommentSchema } from '../types'
import { authOrRedirect } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'
import { revalidatePath } from 'next/cache'

export async function sendComment(data: z.infer<typeof writeCommentSchema>) {
  const { padId, comment } = writeCommentSchema.parse(data)
  const session = await authOrRedirect()

  const padExistsAndPublished = !!(await prisma.pad.findFirst({
    where: {
      id: padId,
      NOT: { published: null },
    },
  }))
  if (!padExistsAndPublished) throw new Error()

  await prisma.comment.create({
    data: {
      text: comment,
      padId: padId,
      userId: session.user.id,
    },
  })

  revalidatePath(`/article/${padId}`)
}

export async function deleteComment(commentId: string) {
  const session = await authOrRedirect()
  z.string().cuid().parse(commentId)
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  })

  if (!(comment.userId === session.user.id)) {
    await prisma.user.findFirstOrThrow({
      where: {
        id: session.user.id,
        role: 'ADMIN',
      },
    })
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  })

  revalidatePath('/(routes)/article/[padId]', 'page')
}
