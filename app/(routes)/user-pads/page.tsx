import { authOrRedirect } from '@/app/_utils/auth'
import UserPadsAppBar from './_components/app-bar'
import { PadsGrid } from './_components/grid/top-level-dnd'
import prisma from '@/app/_utils/db'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await authOrRedirect()

  // checking if logged in user is marked as author
  const isAuthor = !!(await prisma.author.findUnique({
    where: { id: session.user.id },
  }))
  if (!isAuthor) redirect('/author-signup') // ... if not, redirect to author sign-up

  const padInclude = {
    // includes attributes required for _Pad type
    members: {
      select: {
        permission: true,
      },
      where: {
        authorId: session.user.id,
      },
    },
    tags: true,
  }

  // every pad that is not in a series
  const pads = await prisma.pad.findMany({
    where: {
      members: {
        some: { authorId: session.user.id },
      },
      series: null,
    },
    include: padInclude,
  })

  // every series the author has access to
  const serieses = await prisma.series.findMany({
    where: {
      OR: [
        {
          pads: {
            some: { pad: { members: { some: { authorId: session.user.id } } } },
          },
        },
        { ownerId: session.user.id },
      ],
    },
    include: {
      pads: {
        select: {
          indexInSeries: true,
          pad: { include: padInclude },
        },
        where: {
          pad: { members: { some: { authorId: session.user.id } } },
        },
        orderBy: {
          indexInSeries: 'asc',
        },
      },
    },
  })

  const seriesWithOwnerAttribute = serieses.map((oneSeries) => {
    return {
      ...oneSeries,
      isOwner: oneSeries.ownerId === session.user.id,
    }
  })

  return (
    <>
      <UserPadsAppBar />
      <PadsGrid series={seriesWithOwnerAttribute} pads={pads} />
    </>
  )
}
