import prisma from '@/app/_utils/db'
import ActionBar from '@/app/_components/app-bar'
import { notFound } from 'next/navigation'
import { ArticleAuthors } from './_components/author'
import { etherApiReq } from '@/app/api/etherpad/etherApi'
import { CommentSection } from './_components/comment'
import { auth } from '@/app/_utils/auth'
import { SeriesPagination } from './_components/series-overview'

export default async function page({ params }: { params: { padId: string } }) {
  // test if pad exists AND is marked as published
  const pad = await prisma.pad.findFirst({
    where: {
      id: params.padId,
      NOT: { published: null },
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
              NOT: { published: null },
            },
          },
        },
      },
    }))

  // all authors invited to the pad with owner/write permissions
  const authors = await prisma.author.findMany({
    where: {
      pads: {
        some: {
          padId: params.padId,
          permission: {
            in: ['OWNER', 'WRITE'],
          },
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

  let text: string
  try {
    const data = await etherApiReq('getHTML', `padID=${pad.id}`)
    text = data.html // TODO: Author may be able to put malicious code
  } catch (error) {
    text = 'Es konnte keine Verbindung zu Etherpad hergestellt werden.'
  }

  const comments = await prisma.comment.findMany({
    where: {
      padId: params.padId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          author: {
            select: {
              username: true,
            },
          },
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
