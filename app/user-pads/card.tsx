'use client'
import { Button, Card, Dropdown } from "flowbite-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BsEyeFill, BsPencilFill, BsShieldShaded } from "react-icons/bs"
import { HiDotsVertical } from "react-icons/hi"

export default function AuthorPadCard({ pad }: {
    pad: {
        id: string;
        name: string;
        members: {
            permission: 'READ' | 'WRITE' | 'OWNER';
        }[];
    }
}) {
    const router = useRouter()

    return (
        <div className="w-96 relative m-3 cursor-pointer" >
            <Card imgSrc={`https://picsum.photos/400/200?${pad.id}`} onClick={() => { router.push(`/pad/${pad.id}`) }}> {/* Hack for disabling cache */}
                <div className="flex items-center">
                    <p className="text-2xl tracking-tight truncate flex-1">{pad.name}</p>
                    
                    <Dropdown label='hi' renderTrigger={() => <HiDotsVertical />} onClick={(e) => { e.stopPropagation() }} >
                        <Dropdown.Item>Umbenennen</Dropdown.Item>
                    </Dropdown>

                </div>
                <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</p>
            </Card>
            <div className="absolute top-1 left-1 flex place-items-center p-1 space-x-1 rounded-md bg-green-500">
                {
                    {
                        'READ': <><BsEyeFill /><p>LESEN</p></>,
                        'WRITE': <><BsPencilFill /><p>SCHREIBEN</p></>,
                        'OWNER': <><BsShieldShaded /><p>INHABER</p></>
                    }[pad.members[0].permission]
                }
            </div>
        </div>
    )
}
