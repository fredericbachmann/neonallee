'use server'
import { revalidatePadSettings } from '@/app/_actions/pad/utils'
import { auth } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'

export async function getGenreNames() {
  const genres = await prisma.genre.findMany({
    select: {
      name: true,
    },
  })
  return genres.map((genre) => genre.name)
}

export async function updateGenre(padId: string, genreName: string | null) {
  const session = await auth()
  if (!session) return Error()

  await prisma.pad.findFirstOrThrow({
    where: {
      id: padId,
      members: {
        some: {
          authorId: session.user.id,
        },
      },
    },
  })

  await prisma.pad.update({
    where: {
      id: padId,
    },
    data: {
      genreName: genreName,
    },
  })

  revalidatePadSettings(padId)
}
