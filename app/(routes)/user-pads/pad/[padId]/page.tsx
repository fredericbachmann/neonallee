import prisma from '@/app/_utils/db'
import { notFound, redirect } from 'next/navigation'
import { authOrRedirect } from '@/app/_utils/auth'
import { PadAppBar } from './_components/app-bar'

export default async function page({ params }: { params: { padId: string } }) {
  const session = await authOrRedirect()

  const pad = await prisma.pad.findUnique({
    where: {
      id: params.padId,
    },
    include: {
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
      series: {
        select: { series: true },
      },
    },
  })

  if (
    !pad || // pad doesn't exist
    !pad.members.length // user is not a member of this pad
  )
    notFound()

  return (
    <div className='flex flex-col h-screen'>
      <PadAppBar
        isOwner={pad.members[0].permission === 'OWNER'}
        pad={{
          ...pad,
          seriesName: pad.series ? pad.series.series.name : undefined,
        }}
      />
      <iframe
        name='embed_readwrite'
        src={`${process.env.ETHERPAD_EXTERNAL_URL}/p/${params.padId}`}
        className='w-full flex-1'
      />
    </div>
  )
}
