'use client'
import { Card, Modal } from 'flowbite-react'
import { BsEyeFill, BsPencilFill, BsShieldShaded } from 'react-icons/bs'
import { PadSettings } from './pad-settings'
import Link from 'next/link'
import { createContext, useContext, useState } from 'react'
import { Pad, PadsOnSeries, Permission, Series } from '@prisma/client'
import { HiFolder } from 'react-icons/hi'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useRouter } from 'next/navigation'

type PadDetails = (Pad & {
    permission: Permission
})
type _Series = (Series & {   // No plural word for 'series' :(
    pads: PadsOnSeries[]
})

export const PadDetailsContext = createContext<{
    getPad: (padId: string) => PadDetails | undefined,
    updatePads: (changedPad: Partial<PadDetails>) => void
}>({
    getPad: () => { return undefined },
    updatePads: () => { }
}) // contains all information about the pads


export function PadsGrid({ series, pads: padProps, padDetails }: {
    series: _Series[],
    pads: { id: string }[],
    padDetails: PadDetails[]
}) {
    const [pads, setPads] = useState(padDetails)

    /** Updates the pad state in the root
     * @param changedPad an object containing the id and some attributes
     */
    function updatePads(changedPad: Partial<PadDetails>) {
        const index = pads.findIndex(pad => pad.id === changedPad.id)
        const newPad = { ...pads[index], ...changedPad }
        setPads(pads.map(pad => (pad.id === newPad.id ? newPad : pad)))
    }
    function getPad(padId: string) {
        return pads.find(e => e.id === padId)
    }

    return <DndProvider backend={HTML5Backend}>
        <PadDetailsContext.Provider value={{ getPad, updatePads }}>
            <div className="flex flex-wrap justify-center">
                {
                    series.map((series, index) =>
                        <UserPadsSeries series={series} key={index} />
                    )
                }
                {
                    padProps.map((pad, index) =>
                        <AuthorPadCard padId={pad.id} key={index} />
                    )}
            </div>
        </PadDetailsContext.Provider>
    </DndProvider>
}


/** The representation of ONE series for the user-pads page */
export function UserPadsSeries({ series }: { series: _Series }) {
    const [showModal, setShowModal] = useState(false)

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'pad',
        drop: () => ({ id: series.id }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    return <><button onClick={() => setShowModal(true)} ref={drop}>
        <HiFolder className='h-96 w-96' />
    </button>

        <Modal size='7xl' show={showModal} dismissible onClose={() => setShowModal(false)}>
            <Modal.Header>{series.name}</Modal.Header>
            <Modal.Body className='flex flex-wrap justify-center'>
                {series.pads.map((pad, index) =>
                    <AuthorPadCard padId={pad.padId} key={index} />
                )}
            </Modal.Body>
        </Modal>

    </>
}

/** representation card of ONE pad */
export default function AuthorPadCard({ padId }: { padId: string }) {
    const pad = useContext(PadDetailsContext).getPad(padId)

    if (!pad) return <div></div>

    const router = useRouter()

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'pad',
        canDrag: pad.permission === 'OWNER',
        end(item, monitor) {
            const dropResult = monitor.getDropResult<{ id: string }>()
            if (item && dropResult) {
                moveToSeries(dropResult.id)
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }))

    async function moveToSeries(seriesId: string) {
        const res = await fetch(`/api/series?padId=${padId}&seriesId=${seriesId}`, { method: 'PATCH' })
        if (res.ok) {
            router.refresh()
        }
    }


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
                <PadSettings pad={pad} /> 
            </div>}
    </div>
}

