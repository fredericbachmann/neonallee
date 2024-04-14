import { Author, Pad } from '@prisma/client'
import { ProfileTabs } from './tabs'
import Image from 'next/image'
import { use } from 'react'
import prisma from '@/app/_utils/db'
import Link from 'next/link'
import { SeriesList } from './series'
import { BsFacebook, BsTwitterX, BsYoutube } from 'react-icons/bs'
import FollowToggle from './FollowToggle'

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
  following: boolean
  pads: Pad[]
}) {
  const tabs = [
    { title: 'Neu', content: <NewReleases artist={artist} /> },
    { title: "Author's Pick", content: <>Noch nicht implementiert</> },
    { title: 'Serien', content: <Serieses artist={artist} /> },
  ]

  return (
    <>
      <ProfileInfo2 artist={artist} isFollowing={following} />
      <div className='flex flex-col p-3'>
        <ProfileTabs tabs={tabs} />
      </div>
    </>
  )
}

function ProfileInfo({
  artist,
  isFollowing,
}: {
  artist: _Author
  isFollowing: boolean
}) {
  return (
    <div className='flex space-x-5 p-2 pb-7'>
      <div className='flex flex-col space-y-5'>
        <Image
          src={artist.user.image}
          alt='profile picture'
          width={160}
          height={160}
          className='rounded-full'
        />
        <div className='flex space-x-5 justify-center'>
          <BsTwitterX className='h-6 w-6' />
          <BsYoutube className='h-6 w-6' />
          <BsFacebook className='h-6 w-6' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <div className='relative w-min'>
          <div className='bg-highlight absolute w-full h-8 top-3 left-2' />
          <div className='text-4xl font-bold text-gray_ z-10 relative'>
            {artist.artistname.toUpperCase()}
          </div>
        </div>
        <p className='text-gray-500'>{artist.about}</p>
        <FollowToggle
          isFollowing={isFollowing}
          username={artist.username}
          followerCount={artist._count.followers}
        />
      </div>
    </div>
  )
}

function ProfileInfo2({
  artist,
  isFollowing,
}: {
  artist: _Author
  isFollowing: boolean
}) {
  return (
    <div className='relative text-off-white'>
      <Image
        src={'https://picsum.photos/1500/1000'}
        alt=''
        width={1500}
        height={1000}
      />
      <div className='absolute bottom-0 w-screen bg-indigo-800 bg-opacity-80 p-3'>
        <p className='absolute -top-5 pl-2 font-bold text-4xl'>
          {artist.artistname.toUpperCase()}
        </p>
        <p className='py-3'>
          {artist.about ||
            `The alt property is used to describe the image for screen readers and search engines. It is also the fallback text if images have been disabled or an error occurs while loading the image.`}
        </p>
        <FollowToggle
          isFollowing={isFollowing}
          username={artist.username}
          followerCount={artist._count.followers}
        />
      </div>
    </div>
  )
}

export function PadInList({ pad }: { pad: Pad }) {
  return (
    <Link href={`/article/${pad.id}`} key={pad.id}>
      <p className='text-2xl font-bold text-gray-800'>
        {pad.name.toUpperCase()}
      </p>
      <p className='text-gray-600 text-lg'>{pad.description}</p>
    </Link>
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
    <>
      {pads.map((pad) => (
        <PadInList pad={pad} key={pad.id} />
      ))}
    </>
  )
}

function Serieses({ artist }: { artist: Author }) {
  const serieses = use(
    prisma.series.findMany({
      where: {
        ownerId: artist.id,
        pads: { some: { pad: { NOT: { published: null } } } },
      },
      take: 4,
      include: {
        pads: {
          select: { pad: true, indexInSeries: true },
          orderBy: { indexInSeries: 'asc' },
        },
      },
    })
  )
  if (serieses.length === 0) return <></>

  return (
    <>
      {serieses.map((series) => (
        <SeriesList series={series} key={series.id} />
      ))}
    </>
  )
}
