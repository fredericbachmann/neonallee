'use server'

import { authOrRedirect } from '@/app/_utils/auth'
import { z } from 'zod'
import {
  checkIsPadOwner,
  revalidatePadSettings,
} from '@/app/_actions/pad/utils'
import prisma from '@/app/_utils/db'

export default async function togglePublishPad(padId: string) {
  z.string().cuid().parse(padId)
  const session = await authOrRedirect()
  await checkIsPadOwner(padId, session.user.id)

  const pad = await prisma.pad.findUniqueOrThrow({
    where: {
      id: padId,
    },
  })

  if (!!pad.published) {
    await prisma.pad.update({
      data: {
        published: null,
      },
      where: {
        id: padId,
      },
    })
  } else {
    await prisma.pad.update({
      data: {
        published: new Date().toISOString(),
      },
      where: {
        id: padId,
      },
    })
  }

  revalidatePadSettings(padId)
}
