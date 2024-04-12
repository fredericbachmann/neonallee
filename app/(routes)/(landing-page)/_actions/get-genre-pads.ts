'use server'
import prisma from '@/app/_utils/db'
import { z } from 'zod'

export default async function getGenrePads(genreName: string) {
  z.string().parse(genreName)

  const pads = await prisma.pad.findMany({
    where: {
      genreName: genreName,
      published: { not: null },
    },
    take: 10,
    orderBy: {
      published: 'desc',
    },
  })

  return pads
}
