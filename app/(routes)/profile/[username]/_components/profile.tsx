import { Author, Pad } from '@prisma/client'
import Image from 'next/image'
import FollowToggle from './FollowToggle'
import ReadArticleCard from '@/app/(routes)/card'

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

      <div className='flex items-center self-center divide-gray-700 divide-x-2'>
        <div className='pr-2'>
          <FollowToggle username={author.username} isFollowing={following} />
        </div>
        <p className='text-lg text-slate-700 pl-2'>{followerCount} Follower</p>
      </div>

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
  return (
    <div>
      <Image
        src='https://picsum.photos/1500/1000'
        alt=''
        width={1500}
        height={1000}
        className='w-screen'
      />
      <Tile title={pads[0].name} artistname={author.artistname} />
    </div>
  )
}

function Tile({ title, artistname }: { title: string; artistname: string }) {
  return (
    <div className='bg-profile-purple w-36 h-36 flex flex-col'>
      <div className='mt-auto p-2'>
        <p className='text-profile-yellow-400 font-semibold'>
          {title.toUpperCase()}
        </p>
        <p className='text-white text-sm font-medium'>
          {artistname.toUpperCase()}
        </p>
      </div>
    </div>
  )
}
