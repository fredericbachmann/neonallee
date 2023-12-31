'use client'
import { Pad } from '@prisma/client'
import Image from 'next/image'
import { useState } from 'react'

export function Compartment({ index, pad }: { index: number; pad: Pad }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      onClick={() => {
        if (expanded) alert('Weiterleiten zum Text')
        else setExpanded(!expanded)
      }}
      className={`${expanded && 'row-span-2'} flex flex-col align-top`}
    >
      <Card pad={pad} index={index} expanded={expanded} />
    </button>
  )
}

function Card({
  pad,
  index,
  expanded,
}: {
  pad: Pad
  index: number
  expanded: boolean
}) {
  const imageHeight = expanded ? 300 : 150

  return (
    <div>
      <Image
        alt=''
        src={`https://picsum.photos/300/${imageHeight}?${index}`}
        width={300}
        height={imageHeight}
        className='rounded-lg'
      />
      <p className='text-xl'>{pad.name}</p>
      {expanded && <p className='text-slate-700'>{pad.description}</p>}
    </div>
  )
}
