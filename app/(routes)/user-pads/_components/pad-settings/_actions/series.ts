'use server'
import { revalidatePadSettings } from '@/app/_actions/pad/utils'
import { userInputs } from '@/app/_types/schemas'
import { authOrRedirect } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function createSeries(seriesName: string) {
  userInputs.seriesName.parse(seriesName)
  const session = await authOrRedirect()

  const isAuthor = !!(await prisma.author.findUnique({
    where: { id: session.user.id },
  }))
  if (!isAuthor) throw new Error()

  await prisma.series.create({
    data: {
      name: seriesName,
      ownerId: session.user.id,
    },
  })

  revalidatePath('/user-pads/')
}

export async function movePadIntoSeries(padId: string, seriesId: string) {
  const schema = z.string().cuid()
  schema.parse(padId)
  schema.parse(seriesId)
  const session = await authOrRedirect()

  const isPadAndSeriesOwner = !!(await prisma.author.findFirst({
    where: {
      id: session.user.id,
      ownedSeries: {
        some: { id: seriesId },
      },
      pads: {
        some: {
          permission: 'OWNER',
          padId: padId,
        },
      },
    },
  }))
  if (!isPadAndSeriesOwner) throw new Error()

  const indexResult = await prisma.padsOnSeries.findMany({
    where: {
      seriesId: seriesId,
    },
    orderBy: { indexInSeries: 'desc' },
  })
  const lastIndex = indexResult.length > 0 ? indexResult[0].indexInSeries : 0

  await prisma.padsOnSeries.create({
    data: {
      padId: padId,
      seriesId: seriesId,
      indexInSeries: lastIndex + 1,
    },
  })

  revalidatePath('/user-pads/')
}

export async function removePadFromSeries(padId: string) {
  z.string().cuid().parse(padId)
  const session = await authOrRedirect()

  const isPadOwner = !!(await prisma.author.findFirst({
    where: {
      id: session.user.id,
      pads: {
        some: {
          permission: 'OWNER',
          padId: padId,
        },
      },
    },
  }))
  if (!isPadOwner) throw new Error()

  await prisma.padsOnSeries.delete({
    where: {
      padId: padId,
    },
  })

  revalidatePadSettings(padId)
}
