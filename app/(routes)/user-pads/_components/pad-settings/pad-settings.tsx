'use client'
import Delete from './delete'
import { Modal } from 'flowbite-react'
import { HiOutlineCog } from 'react-icons/hi'
import { useState } from 'react'
import { ChangePadName } from './name'
import { PublishPad } from './publish'
import { RemoveFromSeries } from './remove-from-series'
import { _Pad } from '../../types'
import { ShowTags } from './tags'
import { Tag } from '@prisma/client'

/** currently being used in:
 * a) the user-pads page
 *  - for standalone pads
 *  - for pads inside a series
 *
 * b) the pad view (/user-pads/pad/....)
 */
export function PadSettings({
  pad: padProp,
  setPad: setPadProp,
}: {
  pad: _Pad
  setPad?: Function
}) {
  const [pad, setPad] =
    typeof setPadProp === 'undefined' // if state is not managed higher
      ? useState(padProp) // create new state
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
            <ShowTags pad={pad} setPad={setPad} />
            <PublishPad pad={pad} setPad={setPad} />
            {pad.seriesName && (
              <RemoveFromSeries padId={pad.id} seriesName={pad.seriesName} />
            )}
            <Delete padId={pad.id} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
