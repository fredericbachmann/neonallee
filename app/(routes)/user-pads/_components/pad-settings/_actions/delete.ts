'use server'

import { authOrRedirect } from '@/app/_utils/auth'
import { z } from 'zod'
import {
  checkIsPadOwner,
  etherApiReq,
  revalidatePadSettings,
} from '@/app/_actions/pad/utils'
import prisma from '@/app/_utils/db'
import { revalidatePath } from 'next/cache'

export default async function deletePad(padId: string) {
  z.string().cuid().parse(padId)
  const session = await authOrRedirect()
  await checkIsPadOwner(padId, session.user.id)

  try {
    await etherApiReq('deletePad', `padID=${padId}`)
  } catch (err) {
    // if for some reason the pad doesn't exist on etherpad
    if (!(err instanceof Error && err.cause === 'padID does not exist'))
      throw err
  }

  await prisma.pad.delete({
    where: {
      id: padId,
    },
  })

  revalidatePadSettings(padId)
  revalidatePath('/admin')
}
