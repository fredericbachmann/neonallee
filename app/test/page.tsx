'use client'

import { ToggleSwitch } from 'flowbite-react'
import { useState } from 'react'
import ActionBar from '../components/app-bar'
import { prisma } from '../db'
import { Compartment } from './components'

export default function Component() {
  const [switch1, setSwitch1] = useState(false)
  const [switch2, setSwitch2] = useState(true)
  const [switch3, setSwitch3] = useState(true)
export default async function Component() {
  const pads = await prisma.pad.findMany({
    where: {
      published: true,
    },
  })

  return (
    <>
      <ActionBar />
      <div className='max-w-3xl mx-auto'>
        <div className='grid grid-cols-3 gap-4'>
          {pads.map((pad, i) => (
            <Compartment index={i} pad={pad} key={i} />
          ))}
        </div>
      </div>
    </>
  )
}

