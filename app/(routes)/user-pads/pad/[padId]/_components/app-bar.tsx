'use client'
import ActionBar from '@/app/_components/app-bar'
import Members from './members'
import { PadSettings } from '../../../_components/pad-settings/pad-settings'

export function PadAppBar({
  isOwner,
  pad,
}: {
  isOwner: boolean
  pad: {
    id: string
    name: string
    published: boolean
    description: string
    series:
      | {
          id: string
          name: string
          ownerId: string
        }
      | undefined
  } //TODO: series
}) {
  return (
    <ActionBar>
      {isOwner && (
        <div className='h-7 w-7'>
          <PadSettings pad={pad} />
        </div>
      )}
      <Members displayShare={isOwner} />
    </ActionBar>
  )
}
