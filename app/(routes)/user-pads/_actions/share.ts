'use server'

import { z } from 'zod'
import { sharePadSchema } from '@/app/_actions/pad/types'
import { authOrRedirect } from '@/app/_utils/auth'
import {
  checkIsPadOwner,
  revalidatePadSettings,
} from '@/app/_actions/pad/utils'
import prisma from '@/app/_utils/db'

export default async function sharePad(data: z.infer<typeof sharePadSchema>) {
  const { padId, username, permission } = sharePadSchema.parse(data)
  const session = await authOrRedirect()
  await checkIsPadOwner(padId, session.user.id)

  const author = await prisma.author.findUnique({
    // check if the author exists
    where: { username: username },
  })
  if (!author) return 'username-doesnt-exist'

  await prisma.authorsOnPads.upsert({
    where: {
      authorId_padId: {
        authorId: author.id,
        padId: padId,
      },
    },
    create: {
      padId: padId,
      authorId: author.id,
      permission: permission,
    },
    update: {
      permission: permission,
    },
  })

  revalidatePadSettings(padId)
}
