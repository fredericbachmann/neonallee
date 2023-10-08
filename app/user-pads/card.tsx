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
        <div className="container w-96 relative">
            <Link href={`/pad/${pad.id}`}>
                <Card imgSrc="https://picsum.photos/400/200">
                    <p className="text-2xl tracking-tight">{pad.name}</p>
                    <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</p>
                </Card>
            </Link>
            <div className="absolute top-4 left-4 flex place-items-center p-1 space-x-1 rounded-xl bg-green-500">
                {
                    {
                        'READ': <><BsEyeFill /><p>LESEN</p></>,
                        'WRITE': <><BsPencilFill /><p>SCHREIBEN</p></>,
                        'OWNER': <><BsShieldShaded /><p>EIGENTÜMER</p></>
                    }[pad.members[0].permission]
                }
            </div>
        </div>
    )
}
