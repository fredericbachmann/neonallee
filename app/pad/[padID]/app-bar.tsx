'use client'
import ActionBar from "@/app/components/app-bar"
import { useParams } from 'next/navigation'
import Publish from './publish'
import Delete from './delete'
import Members from "./members"

export default function PadAppBar({ isPublished, isOwner }: { isPublished: Boolean, isOwner: Boolean }) {
    const params: { padID: string } = useParams()

    return <ActionBar>
        {isOwner &&
            <>
                <Publish isPublished={isPublished} />
                <Delete />
            </>
        }
        <Members displayShare={isOwner}/>
    </ActionBar>

}