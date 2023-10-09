'use client'
import { Pad } from "@prisma/client"
import { Card } from "flowbite-react"
import Link from "next/link"
import Image from 'next/image'

export default function ReadArticleCard({ pad }: { pad: Pad }) {
  return <Link href={`/article/${pad.id}`}>
    <Card>
      <div className="flex">
        <div className="text-left">
          <h6 className="text-3xl tracking-tight">{pad.name}</h6>
          <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <img src={`https://picsum.photos/100?${pad.id}`} width={100} /> {/* Hack for disabling cache */}
      </div>
    </Card>
  </Link>
}