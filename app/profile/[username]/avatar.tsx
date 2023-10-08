'use client'

import { Avatar } from "flowbite-react"

export default function UserAvatar({img}: {img: string}) {
    return <Avatar img={img} rounded size='lg'/>
}