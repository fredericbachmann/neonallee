'use client'
import { Card } from 'flowbite-react'
import { BsEyeFill, BsPencilFill, BsShieldShaded } from 'react-icons/bs'
import { PadSettings } from './pad-settings'
import Link from 'next/link'
import { useState } from 'react'
import { Pad, PadsOnSeries, Permission, Series } from '@prisma/client'
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useRouter } from 'next/navigation'
import { UserPadsSeries } from './series'

export type PadDetails = (Pad & {
    permission: Permission
})
export type _Series = (Series & {
    pads: PadsOnSeries[],
    isOwner: boolean
})

export function PadsGrid({ series, padsWithoutSeries, pads }: {
    series: _Series[],
    padsWithoutSeries: { id: string }[],
    pads: PadDetails[]
}) {
    function getPadDetails(padId: string) {
        const pad = pads.find(pad => pad.id === padId)
        if (!pad) return undefined
        return { ...pad, series: undefined }
    }

    return <DndProvider backend={HTML5Backend}>
        <div className="flex flex-wrap justify-center">
            {
                series.map((series, index) =>
                    <UserPadsSeries series={series} padDetails={pads} key={index} />
                )
            }
            {
                padsWithoutSeries.map((pad, index) =>
                    <AuthorPadCard pad={getPadDetails(pad.id)} key={index} />
                )}
        </div>
    </DndProvider>
}



/** representation card of ONE pad */
export default function AuthorPadCard({ pad: padProp }: {
    pad: (
        PadDetails & {
            series: Series | undefined
        })
}) {
    const [pad, setPad] = useState(padProp)
    const router = useRouter()

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'pad',
        canDrag: pad && pad.permission === 'OWNER',
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
        const res = await fetch(`/api/series?padId=${padId}&seriesId=${seriesId}`, { method: 'PATCH' })
        if (res.ok) {
            router.refresh()
        }
    }


    if (!pad) return <div>x</div>

    return <div ref={drag} className='w-96 relative m-3 cursor-pointer'>
        <Link href={`/user-pads/pad/${pad.id}`}>
            <Card imgSrc={`https://picsum.photos/400/200?${pad.id}`}> {/* Hack for disabling cache */}
                <div className='flex items-center'>
                    <p className='text-2xl tracking-tight truncate flex-1'>{pad.name}</p>


                </div>
                <p className='text-gray-700'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</p>
            </Card>
            <div className='absolute top-1 left-1 flex place-items-center p-1 space-x-1 rounded-md bg-green-500'>
                {
                    {
                        'READ': <><BsEyeFill /><p>LESEN</p></>,
                        'WRITE': <><BsPencilFill /><p>SCHREIBEN</p></>,
                        'OWNER': <><BsShieldShaded /><p>INHABER</p></>
                    }[pad.permission]
                }
            </div>
        </Link>
        {pad.permission === 'OWNER' &&
            <div className='h-7 w-7 absolute top-2 right-2'>
                <PadSettings pad={pad} setPad={setPad} />
            </div>}
    </div>
}

