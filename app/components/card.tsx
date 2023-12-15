'use client'
import { Pad } from '@prisma/client'
import { Card } from 'flowbite-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ReadArticleCard({ pad }: { pad: Pad }) {
  return (
    <Link href={`/article/${pad.id}`}>
      <Card>
        <div className='flex'>
          <div className='text-left flex-1'>
            <h6 className='text-3xl tracking-tight truncate'>{pad.name}</h6>
            <p className='text-gray-700'>
              {pad.description === ''
                ? 'AutorIn hat keine Beschreibung angegeben...'
                : pad.description}
            </p>
          </div>
          <Image
            alt=''
            src={`https://picsum.photos/100?${pad.id}`}
            width={96}
            height={96}
          />{' '}
          {/* Hack for disabling cache */}
        </div>
      </Card>
    </Link>
  )
}
