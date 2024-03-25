'use client'

import { Author, Tag } from '@prisma/client'
import { Carousel } from 'flowbite-react'
import Link from 'next/link'

export function Pictures() {
  return (
    <Carousel
      slideInterval={5000}
      leftControl
      rightControl
      className='h-72 sm:h-80 xl:h-96'
    >
      {Array.from(Array(5).keys()).map((index) => (
        <img
          src={`https://picsum.photos/3000?${index}`}
          key={index}
          className='object-cover h-full'
        />
      ))}
    </Carousel>
  )
}

export function Tags({ tags }: { tags: Tag[] }) {
  return (
    <div className='bg-off-white p-4 flex space-x-2 items-center overflow-x-auto'>
      <p className='pr-5 text-3xl font-semibold'>GENRES</p>
      {tags.map((tag) => (
        <button
          className='bg-highlight px-10 py-5 text-5xl font-bold rounded-sm'
          key={tag.id}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}

export function FeaturedArtists({ artists }: { artists: Author[] }) {
  return (
    <div className='px-4 grid gap-2 items-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
      <p className='text-3xl font-semibold text-center whitespace-pre'>
        RANDOM{`\n`}ARTISTS
      </p>
      {artists.map((artist, index) => (
        <Link
          href={`/profile/${artist.username}`}
          className='justify-self-center relative'
          key={index}
        >
          <img src={`https://picsum.photos/500?${index}`} />
          <p className='absolute left-3 bottom-5 text-white'>
            {artist.artistname.toUpperCase()}
          </p>
        </Link>
      ))}
    </div>
  )
}
