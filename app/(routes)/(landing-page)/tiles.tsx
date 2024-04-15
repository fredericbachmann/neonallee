'use client'

import { Author, Genre } from '@prisma/client'
import { Carousel } from '@mantine/carousel'
import Link from 'next/link'
import { Modal } from '@mantine/core'
import Image from 'next/image'
import { useState } from 'react'
import GenreModal from './genre-modal'
import deskPic from '@/public/desk.jpg'

export function Pictures() {
  return (
    <div className='h-72 sm:h-80 xl:h-96 flex'>
      <Image
        src={deskPic}
        alt=''
        width={1426}
        height={951}
        className='object-cover'
      />
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
          onClick={() => alert(genre.name)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}

export function Genres2({ genres }: { genres: Genre[] }) {
  const [modalGenre, setModalGenre] = useState<string | undefined>(undefined)

  return (
    <div className='bg-off-white'>
      <div className='flex flex-wrap p-2'>
        {genres.map((genre) => (
          <button
            className='p-2 m-2 rounded-xl border-2 border-highlight hover:bg-highlight font-semibold text-xl'
            key={genre.name}
            onClick={() => setModalGenre(genre.name)}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <Modal
        opened={modalGenre !== undefined}
        onClose={() => setModalGenre(undefined)}
        title={modalGenre}
      >
        {modalGenre && <GenreModal genreName={modalGenre} />}
      </Modal>
    </div>
  )
}

export function FeaturedArtists({ artists }: { artists: Author[] }) {
  return (
    <div className='px-4 grid gap-2 items-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
      <p className='text-3xl font-semibold text-center whitespace-pre'>
        AutorInnen
      </p>
      {artists.map((artist, index) => (
        <Link
          href={`/profile/${artist.username}`}
          className='justify-self-center relative'
          key={index}
        >
          <Image
            src={`https://picsum.photos/500?${index}`}
            alt=''
            height={500}
            width={500}
          />
          <p className='absolute left-3 bottom-5 text-white'>
            {artist.artistname.toUpperCase()}
          </p>
        </Link>
      ))}
    </div>
  )
}
