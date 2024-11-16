'use client'

import { Pad, Series } from '@prisma/client'
import { Modal } from '@mantine/core'
import React, { useState } from 'react'
import { Tile } from './profileWithTiles'
import Link from 'next/link'
import { PadInList } from '@/app/_components/pad-link'
import { HiArrowRight } from 'react-icons/hi2'

export function SeriesTiles({
  series,
  artistname,
}: {
  series: Series & {
    pads: { padId: string; indexInSeries: number; pad: { name: string } }[]
  }
  artistname: string
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        <Tile artistname={artistname} title={series.name} />
      </button>
      <Modal opened={showModal} onClose={() => setShowModal(false)}>
        <div className='grid grid-cols-2 gap-y-3'>
          {series.pads.map((pad) => (
            <React.Fragment key={pad.padId}>
              <p className='text-4xl text-profile-blue-200 font-semibold text-center pt-2'>
                {`Teil ${pad.indexInSeries + 1}`}
              </p>
              <Link href={`/article/${pad.padId}`}>
                <Tile artistname={artistname} title={pad.pad.name} />
              </Link>
            </React.Fragment>
          ))}
        </div>
      </Modal>
    </>
  )
}

export function SeriesList({
  series,
}: {
  series: Series & {
    pads: { indexInSeries: number; pad: Pad }[]
  }
}) {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className='flex items-center space-x-3'
      >
        <p className='text-2xl font-bold text-gray-800'>
          {series.name.toUpperCase()}
        </p>
        <HiArrowRight className='w-5 h-5' />
      </button>
      <Modal opened={showModal} onClose={() => setShowModal(false)}>
        <div className='grid grid-cols-[80px_auto] gap-y-7'>
          {series.pads.map(({ pad, indexInSeries }) => (
            <React.Fragment key={pad.id}>
              <p className='text-2xl font-bold text-gray-700'>
                Teil {indexInSeries + 1}
              </p>
              <PadInList pad={pad} key={pad.id} />
            </React.Fragment>
          ))}
        </div>
      </Modal>
    </>
  )
}
