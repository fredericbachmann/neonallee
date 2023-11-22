'use server'

import { auth } from '@/utils/auth'
import { prisma } from '../db'

export async function serverEditSeries(
  seriesId: string,
  pads: {
    padId: string
    indexInSeries: number
  }[]
) {
  if (
    !pads.every(
      (pad) =>
        'padId' in pad &&
        'indexInSeries' in pad &&
        typeof pad.indexInSeries === 'number'
    )
  ) {
    throw new Error()
  }

  const session = await auth()
  if (!session) throw new Error()

  // check that the series belongs to the user
  const series = await prisma.series.findFirstOrThrow({
    where: {
      id: seriesId,
      ownerId: session.user.id,
    },
    include: {
      pads: true,
    },
  })

  // check that every given pad is in the series already
  const padsInSeries = pads.every((pad) =>
    series.pads.find((pad2) => pad2.padId === pad.padId)
  )
  if (!padsInSeries) throw new Error()

  // remove the old pads from the series
  await prisma.padsOnSeries.deleteMany({
    where: { seriesId: seriesId },
  })

  // and add the new ones
  await prisma.series.update({
    where: { id: seriesId },
    data: {
      pads: {
        createMany: {
          data: pads,
        },
      },
    },
  })
}
