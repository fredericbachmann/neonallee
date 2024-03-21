import { Author, Pad } from '@prisma/client'
import { ProfileTabs } from './tabs'
import Image from 'next/image'
import { use } from 'react'
import prisma from '@/app/_utils/db'
import Link from 'next/link'

type _Author = Author & {
  user: { image: string }
  _count: { followers: number }
}

export function Profile3({
  artist,
  following,
  pads,
}: {
  artist: _Author
  following: boolean | undefined
  pads: Pad[]
}) {
  const tabs = [
    { title: 'Neu', content: <NewReleases artist={artist} /> },
    { title: "Author's Pick", content: <>2</> },
    { title: 'Serien', content: <>3</> },
  ]

  return (
    <div className='flex flex-col p-3'>
      <ProfileInfo artist={artist} />
      <ProfileTabs tabs={tabs} />
    </div>
  )
}

function ProfileInfo({ artist }: { artist: _Author }) {
  return (
    <div className='flex space-x-5 p-2 pb-7'>
      <div className='flex flex-col'>
        <Image
          src={artist.user.image}
          alt='profile picture'
          width={160}
          height={160}
          className='rounded-full'
        />
        <p>Social...</p>
      </div>
      <div className='flex flex-col space-y-3'>
        <div className='relative w-min'>
          <div className='bg-profile-yellow-900 absolute w-full h-8 top-3 left-2 -z-10' />
          <p className='text-4xl font-bold text-profile-blue-500'>
            {artist.artistname.toUpperCase()}
          </p>
        </div>
        <p className='text-gray-500'>{artist.about}</p>
      </div>
    </div>
  )
}

function NewReleases({ artist }: { artist: Author }) {
  const pads = use(
    prisma.pad.findMany({
      where: {
        members: { some: { authorId: artist.id } },
        NOT: { published: null },
      },
      orderBy: { published: 'desc' },
      take: 4,
    })
  )

  return (
    <ul className='flex flex-col space-y-8'>
      {pads.map((pad) => (
        <Link href={`/article/${pad.id}`} key={pad.id}>
          <p className='text-3xl font-semibold text-profile-blue-500'>
            {pad.name.toUpperCase()}
          </p>
          <p className='text-profile-blue-400 text-lg'>{pad.description}</p>
        </Link>
      ))}
    </ul>
  )
}
