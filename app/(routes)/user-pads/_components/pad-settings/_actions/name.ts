'use server'

import { z } from 'zod'
import { authOrRedirect } from '@/app/_utils/auth'
import {
  checkIsPadOwner,
  revalidatePadSettings,
} from '@/app/_actions/pad/utils'
import prisma from '@/app/_utils/db'
import { changePadNameSchema } from './types'

type schemaType = z.infer<typeof changePadNameSchema>

export default async function changePadName(data: schemaType) {
  const { padId, padName } = changePadNameSchema.parse(data)
  const session = await authOrRedirect()
  await checkIsPadOwner(padId, session.user.id)

  await prisma.pad.update({
    where: {
      id: padId,
    },
    data: {
      name: padName,
    },
  })

  revalidatePadSettings(padId)
}
