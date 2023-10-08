'use client'
import { Pad } from "@prisma/client"
import { Card } from "flowbite-react"
import Link from "next/link"

export default function ReadArticleCard(props: {pad: Pad}) {
    return <Link href={`/article/${props.pad.id}`}>
    <Card className="my-5">
      
      <hr />
      <div className="flex">
        <div className="text-left">
          <h6 className="text-3xl tracking-tight">{props.pad.name}</h6>
          <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <img src="https://picsum.photos/100" width={100} />
      </div>
    </Card>
  </Link>
}