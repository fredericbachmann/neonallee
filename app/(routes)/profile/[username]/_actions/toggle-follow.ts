'use server'
import { authOrRedirect } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'
import { revalidatePath } from 'next/cache'

export async function toggleFollow(username: string) {
  const session = await authOrRedirect()
  const following = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      following: {
        some: {
          username: username,
        },
      },
    },
  })

  if (!following) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        following: {
          connect: {
            username: username,
          },
        },
      },
    })
  } else {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        following: {
          disconnect: {
            username: username,
          },
        },
      },
    })
  }

  revalidatePath(`/profile/${username}`)
}
