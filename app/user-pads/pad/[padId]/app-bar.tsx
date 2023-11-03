'use client'
import ActionBar from '@/app/components/app-bar'
import Members from './members'
import { PadSettings } from './pad-settings'

export function PadAppBar({ isOwner, pad }: {
    isOwner: boolean,
    pad: {
        id: string
        name: string
        published: boolean
    }
}) {

    return <ActionBar>
        {isOwner &&
            <div className='h-7 w-7'>
                <PadSettings pad={pad} />
            </div>
        }
        <Members displayShare={isOwner} />
    </ActionBar>
}


