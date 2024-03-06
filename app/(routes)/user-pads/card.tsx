'use client'
import { Card } from 'flowbite-react'
import { BsEyeFill, BsPencilFill, BsShieldShaded } from 'react-icons/bs'
import { PadSettings } from './_components/pad-settings/pad-settings'
import Link from 'next/link'
import { useState } from 'react'
import { Pad, Permission, Series } from '@prisma/client'
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useRouter } from 'next/navigation'
import { UserPadsSeries } from './series'

export type PadWithPermission = Pad & {
  members: {
    permission: Permission
  }[]
}

export type _Series = Series & {
  pads: {
    indexInSeries: number
    pad?: PadWithPermission
  }[]
  isOwner: boolean
}

export function PadsGrid({
  series,
  pads,
}: {
  series: _Series[]
  pads: PadWithPermission[]
}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex flex-wrap justify-center'>
        {series.map((series, index) => (
          <UserPadsSeries series={series} key={index} />
        ))}
        {pads.map((pad, index) => (
          <AuthorPadCard pad={pad} key={index} />
        ))}
      </div>
    </DndProvider>
  )
}

/** representation card of ONE pad */
export function AuthorPadCard({
  pad: padProp,
  series,
}: {
  pad: PadWithPermission
  series?: Series
}) {
  const [pad, setPad] = useState(padProp)
  const router = useRouter()
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
        <Card imgSrc={`https://picsum.photos/400/200?${pad.id}`}>
          {/* Hack for disabling cache */}
          <div className='flex items-center'>
            <p className='text-2xl tracking-tight truncate flex-1'>
              {pad.name}
            </p>
          </div>
          <p className='text-gray-700'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            bibendum venenatis tincidunt..
          </p>
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
          <PadSettings pad={{ ...pad, series: series }} setPad={setPad} />
        </div>
      )}
    </div>
  )
}
