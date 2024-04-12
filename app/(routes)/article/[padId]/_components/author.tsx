'use client'

import { Author } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

export function ArticleAuthors({
  authors,
}: {
  authors: (Author & {
    user: {
      image: string | null
    }
  })[]
}) {
  return (
    <div className='space-y-2'>
      {authors.map((author) => (
        <div key={author.id} className='max-w-fit'>
          <Link href={`/profile/${author.username}`}>
            <div className='flex space-x-3 place-items-center'>
              <Image
                alt='avatar of author'
                src={author.user.image!}
                height={40}
                width={40}
                className='rounded-full'
              />
              <div>{author.artistname}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
