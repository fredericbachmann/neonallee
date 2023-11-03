'use client'
import { Card } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { BsEyeFill, BsPencilFill, BsShieldShaded } from 'react-icons/bs'
import { PadSettings } from './pad/[padId]/pad-settings'
import Link from 'next/link'

export default function AuthorPadCard({ pad }: {
    pad: {
        id: string
        name: string
        published: boolean
        members: {
            permission: 'READ' | 'WRITE' | 'OWNER'
        }[];
    }
}) {
    const router = useRouter()

    return (
        <Link href={`/user-pads/pad/${pad.id}`} className='w-96 relative m-3 cursor-pointer'>
            <Card imgSrc={`https://picsum.photos/400/200?${pad.id}`}> {/* Hack for disabling cache */}
                <div className='flex items-center'>
                    <p className='text-2xl tracking-tight truncate flex-1'>{pad.name}</p>

                    <div className='h-6 w-6'>
                        <PadSettings pad={pad} />
                    </div>
                </div>
                <p className='text-gray-700'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</p>
            </Card>
            <div className='absolute top-1 left-1 flex place-items-center p-1 space-x-1 rounded-md bg-green-500'>
                {
                    {
                        'READ': <><BsEyeFill /><p>LESEN</p></>,
                        'WRITE': <><BsPencilFill /><p>SCHREIBEN</p></>,
                        'OWNER': <><BsShieldShaded /><p>INHABER</p></>
                    }[pad.members[0].permission]
                }
            </div>
        </Link>
    )
}
