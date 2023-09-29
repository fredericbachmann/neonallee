'use client'
import ActionBar from "@/app/components/app-bar"
import { useParams } from 'next/navigation'
import Publish from './publish'
import Delete from './delete'
import Share from "./share"

export default function PadAppBar() {
    const params: { padID: string } = useParams()

    return <ActionBar>
        <Publish padID={params.padID} />
        <Delete padID={params.padID} />
        <Share padID={params.padID} />
    </ActionBar>

}