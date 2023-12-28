import { auth } from '@/utils/auth'
import UserPadsAppBar from './app-bar'
import { PadsGrid } from './card'
import prisma from '../../utils/db'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/api/auth/signin')

  // checking if logged in user is marked as author
  const isAuthor = !!(await prisma.author.findUnique({
    where: { id: session.user.id },
  }))
  if (!isAuthor) redirect('/author-signup') // ... if not, redirect to author sign-up

  // every pad that is not in a series
  const pads = await prisma.pad.findMany({
    where: {
      members: {
        some: { authorId: session.user.id },
      },
      series: null,
    },
    include: {
      members: {
        select: {
          permission: true,
        },
        where: {
          authorId: session.user.id,
        },
      },
    },
  })

  // every series the author has access to
  const series = await prisma.series.findMany({
    where: {
      OR: [
        {
          pads: {
            some: { pad: { members: { some: { authorId: session.user.id } } } },
          },
        },
        {
          ownerId: session.user.id,
        },
      ],
    },
    include: {
      pads: {
        select: {
          indexInSeries: true,
          pad: {
            include: {
              members: {
                select: {
                  permission: true,
                },
                where: {
                  authorId: session.user.id,
                },
              },
            },
          },
        },
        where: {
          pad: {
            members: { some: { authorId: session.user.id } },
          },
        },
        orderBy: {
          indexInSeries: 'asc',
        },
      },
    },
  })

  const seriesWithOwner = series.map((oneSeries) => {
    return {
      ...oneSeries,
      isOwner: oneSeries.ownerId === session.user.id,
    }
  })

  return (
    <>
      <UserPadsAppBar />
      <PadsGrid series={seriesWithOwner} pads={pads} />
    </>
  )
}
