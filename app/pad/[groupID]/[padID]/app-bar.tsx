'use client'
import { MdDelete } from 'react-icons/md'
import ActionBar from "@/app/components/app-bar"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from 'flowbite-react'

export default function PadAppBar() {
    const params = useParams()
    return <ActionBar>
        <Link href='/' onClick={async () => { await fetch(`/api/etherpad/delete/${params.groupID}`) }}>
            <MdDelete className='w-7 h-7'/>
        </Link>
        <Button color='success' >Teilen</Button>
    </ActionBar>

}