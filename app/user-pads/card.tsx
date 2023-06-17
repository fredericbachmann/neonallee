'use client'
import { useRouter } from "next/navigation"
import { Card } from "flowbite-react"
import Link from "next/link"

export default function ArticleCard({ padIDs }: { padIDs: string[] }) {
    const router = useRouter()

    function getCard(padID: string) {
        return (
            <div className="w-96">
                <Link id={padID[0]} href={`/pad/${padID[0].replace('$', '/')}`}>
                    <Card imgSrc="https://picsum.photos/400/200">
                        <h5 className="text-2xl tracking-tight">Titel</h5>
                        <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</p>
                    </Card>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap justify-center">
            {
                padIDs.map((padID) => {
                    if (padID[0]) {
                        return <div className="p-5">
                            {getCard(padID)}
                        </div>

                    }
                })}
        </div>
    )
}
