'use client'
import { Card } from "flowbite-react"
import Link from "next/link"
import { BsEyeFill, BsPencilFill, BsShieldShaded } from "react-icons/bs"

export default function AuthorPadCard({ pad }: {
    pad: {
        id: string;
        name: string;
        members: {
            permission: 'READ' | 'WRITE' | 'OWNER';
        }[];
    }
}) {
    return (
        <div className="w-96 relative m-3" >
            <Link href={`/pad/${pad.id}`}>
                <Card imgSrc={`https://picsum.photos/400/200?${pad.id}`}> {/* Hack for disabling cache */}
                    <p className="text-2xl tracking-tight">{pad.name}</p>
                    <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</p>
                </Card>
            </Link>
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
