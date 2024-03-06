'use client'
import Delete from './delete'
import { Modal } from 'flowbite-react'
import { HiOutlineCog } from 'react-icons/hi'
import { useState } from 'react'
import { Series } from '@prisma/client'
import { ChangePadName } from './change-name'
import { PublishPad } from './publish'
import { RemoveFromSeries } from './remove-from-series'

export type _Pad = {
  id: string
  name: string
  published: boolean
  description: string
  series?: Series
}

export function PadSettings({
  pad: padProp,
  setPad: setPadProp,
}: {
  pad: _Pad
  setPad?: Function
}) {
  const [state, setState] = useState(padProp)
  const [pad, setPad] =
    typeof setPadProp === 'undefined' // if state is not managed higher
      ? [state, setState] // create new one
      : [padProp, setPadProp] // use higher state

  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className='h-full w-full cursor-pointer'
      >
        <HiOutlineCog className='h-full w-full rounded-full bg-white hover:bg-gray-400' />
      </button>
      <Modal show={showModal} dismissible onClose={() => setShowModal(false)}>
        <Modal.Header>Einstellungen</Modal.Header>
        <Modal.Body>
          <div className='space-y-8'>
            <ChangePadName pad={pad} setPad={setPad} />
            <PublishPad pad={pad} setPad={setPad} />
            <RemoveFromSeries pad={pad} setPad={setPad} />
            <Delete _padId={pad.id} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
