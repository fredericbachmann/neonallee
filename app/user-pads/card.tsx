'use client'
import { Card } from 'flowbite-react'
import { BsEyeFill, BsPencilFill, BsShieldShaded } from 'react-icons/bs'
import { PadSettings } from './pad-settings'
import Link from 'next/link'
import { useState } from 'react'

export default function AuthorPadCard({ pad: padParam }: {
    pad: {
        id: string
        name: string
        published: boolean
        description: string
        permission: 'READ' | 'WRITE' | 'OWNER'
    }
}) {
    const [pad, setPad] = useState(padParam)

    function updatePad(name: string | undefined = undefined, published: boolean | undefined = undefined, description: string | undefined = undefined) {
        if (name) {
            setPad({ ...pad, name: name })
        } else if (typeof published !== 'undefined') {
            setPad({ ...pad, published: published })
        } else if (description) {
            setPad({ ...pad, description: description })
        }
    }

    return <div className='w-96 relative m-3 cursor-pointer'>
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
            <div className='h-7 w-7 absolute top-2 right-2' onClick={(e) => e.stopPropagation()}>
                <PadSettings pad={pad} updatePad={updatePad} />
            </div>}
    </div>
}
