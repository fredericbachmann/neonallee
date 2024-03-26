'use client'
import { Card, Image } from '@mantine/core'
import { BsEyeFill, BsPencilFill, BsShieldShaded } from 'react-icons/bs'
import { PadSettings } from '../pad-settings/pad-settings'
import Link from 'next/link'
import { useState } from 'react'
import { useDrag } from 'react-dnd'
import { useRouter } from 'next/navigation'
import { _Pad } from '../../types'

/** representation card of ONE pad for user-pads */
export function UserPadsPad({ pad: padProp }: { pad: _Pad }) {
  const router = useRouter()
  const [pad, setPad] = useState(padProp)
  const permission = pad.members[0].permission

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'pad',
    canDrag: permission === 'OWNER',
    end(item, monitor) {
      const dropResult = monitor.getDropResult<{ id: string }>()
      if (item && dropResult && pad) {
        moveToSeries(pad.id, dropResult.id)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  async function moveToSeries(padId: string, seriesId: string) {
    const res = await fetch(`/api/series?padId=${padId}&seriesId=${seriesId}`, {
      method: 'PATCH',
    })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <div ref={drag} className='w-96 relative m-3 cursor-pointer'>
      <Link href={`/user-pads/pad/${pad.id}`}>
        <Card shadow='lg'>
          <Card.Section>
            <Image src={`https://picsum.photos/400/200?${pad.id}`} />
          </Card.Section>
          {/* Hack for disabling cache */}
          <div className='flex items-center p-3'>
            <p className='text-2xl tracking-tight truncate flex-1'>
              {pad.name}
            </p>
          </div>
          <p className='text-gray-700'>{pad.description}</p>
        </Card>
        <div className='absolute top-1 left-1 flex place-items-center p-1 space-x-1 rounded-md bg-green-500'>
          {
            {
              READ: (
                <>
                  <BsEyeFill />
                  <p>LESEN</p>
                </>
              ),
              WRITE: (
                <>
                  <BsPencilFill />
                  <p>SCHREIBEN</p>
                </>
              ),
              OWNER: (
                <>
                  <BsShieldShaded />
                  <p>INHABER</p>
                </>
              ),
            }[permission]
          }
        </div>
      </Link>
      {permission === 'OWNER' && (
        <div className='h-7 w-7 absolute top-2 right-2'>
          <PadSettings pad={pad} setPad={setPad} />
        </div>
      )}
    </div>
  )
}
