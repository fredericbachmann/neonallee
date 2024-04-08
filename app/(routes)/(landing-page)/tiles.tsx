'use client'

import { Author, Genre } from '@prisma/client'
import { Carousel } from '@mantine/carousel'
import Link from 'next/link'
import { Image } from '@mantine/core'

export function Pictures() {
  return (
    <div className='h-72 sm:h-80 xl:h-96 flex'>
      <Carousel withIndicators height='100%' style={{ flex: 1 }}>
        {Array.from(Array(5).keys()).map((index) => (
          <Carousel.Slide key={index}>
            <Image src={`https://picsum.photos/3000?${index}`} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  )
}

export function Genres({ genres }: { genres: Genre[] }) {
  return (
    <div className='bg-off-white p-4 flex space-x-2 items-center overflow-x-auto'>
      <p className='pr-5 text-3xl font-semibold'>GENRES</p>
      {genres.map((genre) => (
        <button
          className='bg-highlight px-10 py-5 text-5xl font-bold rounded-sm'
          key={genre.name}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}

export function Genres2({ genres }: { genres: Genre[] }) {
  return (
    <div className='bg-off-white'>
      <p className='p-4 -mb-4 text-3xl'>GENRES</p>
      <div className='flex flex-wrap p-4'>
        {genres.map((genre) => (
          <button
            className='p-2 m-2 rounded-xl border-2 border-highlight hover:bg-highlight font-medium text-3xl'
            key={genre.name}
          >
            {genre.name}
          </button>
        ))}
      </div>
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
