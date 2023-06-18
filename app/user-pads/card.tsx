'use client'
import { Card } from "flowbite-react"
import Link from "next/link"

export default function ArticleCard({ pads }: { pads: { etherPadID: string; etherGroupID: string; }[] }) {

    function getCard(pad: { etherPadID: string; etherGroupID: string; }) {
        return (
            <div className="w-96">
                <Link href={`/pad/${pad.etherGroupID}/${pad.etherPadID}`}>
                    <Card imgSrc="https://picsum.photos/400/200">
                        <h5 className="text-2xl tracking-tight">{pad.etherPadID}</h5>
                        <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</p>
                    </Card>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap justify-center">
            {
                pads.map((pad) => {
                    return <div className="p-5" id={pad.etherGroupID}>
                        {getCard(pad)}
                    </div>
                })}
        </div>
    )
}
