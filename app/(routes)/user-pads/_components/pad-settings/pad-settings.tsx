'use client'
import Delete from './delete'
import { Modal } from '@mantine/core'
import { HiOutlineCog } from 'react-icons/hi'
import { useState } from 'react'
import { ChangePadName } from './name'
import { PublishPad } from './publish'
import { RemoveFromSeries } from './remove-from-series'
import { _Pad } from '../../types'
import Genre from './genre'

/** currently being used in:
 * a) the user-pads page
 *  - for standalone pads
 *  - for pads inside a series
 *
 * b) the pad view (/user-pads/pad/....)
 */
export function PadSettings({ pad }: { pad: _Pad }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className='h-full w-full cursor-pointer'
      >
        <HiOutlineCog className='h-full w-full rounded-full bg-white hover:bg-gray-400' />
      </button>
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title='Einstellungen'
      >
        <div className='space-y-8'>
          <ChangePadName pad={pad} />
          <Genre pad={pad} />
          <PublishPad pad={pad} />
          {pad.seriesName && (
            <RemoveFromSeries padId={pad.id} seriesName={pad.seriesName} />
          )}
          <Delete padId={pad.id} />
        </div>
      </Modal>
    </>
  )
}
