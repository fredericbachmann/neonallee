import ActionBar from '@/app/_components/app-bar'
import Members from './members'
import { PadSettings } from '../../../_components/pad-settings/pad-settings'
import { _Pad } from '../../../types'

export function PadAppBar({
  isOwner,
  pad,
  members,
}: {
  isOwner: boolean
  pad: _Pad
  members: _Members
}) {
  return (
    <ActionBar>
      {isOwner && (
        <div className='h-7 w-7'>
          <PadSettings pad={pad} />
        </div>
      )}
      <Members displayShare={isOwner} members={members} />
    </ActionBar>
  )
}
