import ActionBar from '@/app/_components/app-bar'
import prisma from '@/app/_utils/db'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

export default async function Page() {
  const artists = await prisma.author.findMany({
    where: {
      pads: {
        some: { pad: { published: { not: null } }, permission: 'OWNER' },
      },
    },
  })

  return (
    <>
      <ActionBar />
      <div className='flex flex-col p-4 space-y-2'>
        {artists.map((artist) => (
          <Link
            href={`/profile/${artist.username}`}
            className='p-4 rounded-lg bg-highlight'
            key={artist.id}
          >
            {artist.artistname}
          </Link>
        ))}
      </div>
    </>
  )
}
