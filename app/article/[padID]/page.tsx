import { prisma } from '@/app/db'
import ActionBar from '../../components/app-bar'
import { notFound } from 'next/navigation'
import { ArticleAuthors } from './author'
import { etherApiReq } from '@/app/api/etherpad/etherApi'
import { CommentSection } from './comment'
import { auth } from '@/utils/auth'
import { SeriesPagination } from './series-overview'

export default async function page({ params }: { params: { padId: string } }) {
  // test if pad exists AND is marked as published
  const pad = await prisma.pad.findFirst({
    where: {
      id: params.padId,
      published: true,
    },
    include: {
      series: { select: { seriesId: true } },
    },
  })
  if (!pad) notFound()

  const series =
    pad.series &&
    (await prisma.series.findUnique({
      where: {
        id: pad.series.seriesId,
      },
      include: {
        pads: {
          where: {
            pad: {
              published: true,
            },
          },
        },
      },
    }))

  // all authors invited to the pad with read/write
  const authors = await prisma.author.findMany({
    where: {
      pads: {
        some: {
          permission: {
            in: ['OWNER', 'WRITE'],
          },
          padId: params.padId,
        },
      },
    },
    select: {
      username: true,
      id: true,
      user: {
        select: {
          image: true,
        },
      },
    },
  })

  const data = await etherApiReq('getHTML', `padID=${pad.id}`)
  const text: string = data.html

  const comments = await prisma.comment.findMany({
    where: {
      padId: params.padId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const session = await auth()
  const isAdmin =
    !!session &&
    !!(await prisma.user.findFirst({
      where: {
        id: session.user.id,
        role: 'ADMIN',
      },
    }))

  return (
    <>
      <ActionBar />
      <div className='max-w-3xl mx-auto p-5 flex flex-col space-y-7'>
        <ArticleAuthors authors={authors} />
        <div className='text-5xl font-semibold'>{pad.name}</div>
        <div dangerouslySetInnerHTML={{ __html: text }} />
        <br />
        {series && series.pads.length > 1 && (
          <SeriesPagination pads={series.pads} />
        )}
        <hr />
        <CommentSection isAdmin={isAdmin} commentsProp={comments} />
      </div>
    </>
  )
}
