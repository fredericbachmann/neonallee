import { Author, Pad } from '@prisma/client'
import Image from 'next/image'
import FollowToggle from './FollowToggle'
import ReadArticleCard from '@/app/(routes)/card'
import Link from 'next/link'
import prisma from '@/app/_utils/db'
import { use } from 'react'
import { SeriesTiles } from './series'

export function Profile({
  author,
  following,
  followerCount,
  pads,
}: {
  author: Author & { user: { image: string | null } }
  following: boolean | undefined
  followerCount: number
  pads: Pad[]
}) {
  return (
    <div className='flex flex-col space-y-8 max-w-3xl mx-auto p-5'>
      <div className='grid grid-flow-col space-x-2'>
        <Image
          alt='profile picture'
          src={author.user.image!}
          height={80}
          width={80}
          className='rounded-full row-span-2 place-self-end'
        />
        <p className='text-3xl self-end'>{author.artistname}</p>
        <p className='text-sm'>@{author.username}</p>
      </div>

      <FollowToggle
        username={author.username}
        isFollowing={following}
        followerCount={followerCount}
      />

      <div>
        <p className='text-2xl text-slate-700 place-self-start'>Über mich:</p>
        <p>{author.about === '' ? '---' : author.about}</p>
      </div>
      {pads.length > 0 ? (
        <div className='flex flex-col space-y-2'>
          <p className='text-3xl text-slate-700'>Veröffentlichte Artikel:</p>
          {pads.map((pad, index) => (
            <ReadArticleCard pad={pad} key={index} />
          ))}
        </div>
      ) : (
        <>Noch keine Artikel verfasst.</>
      )}
    </div>
  )
}

export function Profile2({
  author,
  following,
  followerCount,
  pads,
}: {
  author: Author & { user: { image: string | null } }
  following: boolean | undefined
  followerCount: number
  pads: Pad[]
}) {
  const elements = [<NewReleases artist={author} />, <Series artist={author} />]

  return (
    <div>
      <Image
        src='https://picsum.photos/1500/1000'
        alt=''
        width={1500}
        height={1000}
        className='w-screen'
      />
      {elements.map((el, index) => (
        <div
          className={
            index % 2
              ? 'bg-profile-blue-100 text-profile-blue-200'
              : 'bg-profile-blue-200 text-profile-yellow-400'
          }
          key={el.key}
        >
          {el}
        </div>
      ))}
    </div>
  )
}

const tileSizes = 'w-36 h-36 shrink-0'

export function Tile({
  title,
  artistname,
}: {
  title: string
  artistname: string
}) {
  return (
    <div
      className={'bg-profile-purple flex flex-col p-2 text-start ' + tileSizes}
    >
      <p className='text-profile-yellow-400 font-semibold mt-auto'>
        {title.toUpperCase()}
      </p>
      <p className='text-white text-sm font-medium'>
        {artistname.toUpperCase()}
      </p>
    </div>
  )
}

const Scrollable = ({
  children,
  caption,
}: {
  children: React.ReactNode
  caption: string
}) => (
  <div className='p-2 flex space-x-2 overflow-x-auto'>
    <div
      className={
        'text-3xl flex flex-col justify-center items-center font-semibold ' +
        tileSizes
      }
    >
      {caption}
    </div>
    {children}
  </div>
)

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
    <Scrollable caption='NEU'>
      {pads.map((pad) => (
        <Link href={`/article/${pad.id}`} key={pad.id}>
          <Tile artistname={artist.artistname} title={pad.name} key={pad.id} />
        </Link>
      ))}
    </Scrollable>
  )
}

function Series({ artist }: { artist: Author }) {
  const serieses = use(
    prisma.series.findMany({
      where: {
        ownerId: artist.id,
        pads: { some: { pad: { NOT: { published: null } } } },
      },
      take: 4,
      include: {
        pads: {
          select: {
            padId: true,
            indexInSeries: true,
            pad: { select: { name: true } },
          },
          orderBy: { indexInSeries: 'asc' },
        },
      },
    })
  )
  if (serieses.length === 0) return <></>

  return (
    <Scrollable caption='SERIEN'>
      {serieses.map((series) => (
        <SeriesTiles
          key={series.id}
          series={series}
          artistname={artist.artistname}
        />
      ))}
    </Scrollable>
  )
}
