'use client'
import { Pad } from '@prisma/client'
import { Card } from 'flowbite-react'
import Image from 'next/image'
import { useState } from 'react'

export function Compartment({ index, pad }: { index: number; pad: Pad }) {
  const rand = Math.random() < 0.5
  const [showDescription, setShowDescription] = useState(false)

  return (
    <button
      onClick={() => {
        setShowDescription(!showDescription)
      }}
      className={`${showDescription ? 'h-96 row-span-2' : 'h-48'}`}
    >
      <Expanded pad={pad} />
    </button>
  )
}

function Description({ pad }: { pad: Pad }) {
  return <p>{pad.name}</p>
}

function Expanded({ pad }: { pad: Pad }) {
  return (
    <div className='w-full h-full'>
      <Image
        alt=''
        src={`https://picsum.photos/200/100?${pad.id}`}
        width={200}
        height={100}
        className='rounded-lg'
      />
      <p className=''>{pad.name}</p>
    </div>
  )
}
