'use client'
import { Button } from '@mantine/core'
import { toggleFollow } from '../_actions/toggle-follow'

export default function FollowToggle({
  username,
  isFollowing,
  followerCount,
}: {
  username: string
  isFollowing: boolean
  followerCount: number
}) {
  return (
    <div className='flex items-center divide-gray-700 divide-x-2'>
      <div className='pr-2'>
        <Button
          color={isFollowing ? '' : 'green'}
          onClick={() => toggleFollow(username)}
        >
          {isFollowing ? 'Entfolgen' : 'Folgen'}
        </Button>
      </div>
      <p className='text-lg text-slate-700 pl-2'>{followerCount} Follower</p>
    </div>
  )
}
