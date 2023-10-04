'use client'
import { Pad } from "@prisma/client";
import { Card } from "flowbite-react"
import Link from "next/link"

export default function ArticleCard({ pad }: { pad: Pad }) {
    return (
        <div className="w-96">
            <Link href={`/pad/${pad.id}`}>
                <Card imgSrc="https://picsum.photos/400/200">
                    <h5 className="text-2xl tracking-tight">{pad.name}</h5>
                    <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</p>
                </Card>
            </Link>
        </div>
    )
}
