'use client'
import { Button } from 'flowbite-react'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function FollowToggle({
  username,
  isFollowing,
  followerCount,
}: {
  username: string
  isFollowing: boolean | undefined
  followerCount: number
}) {
  const [following, setFollowing] = useState(isFollowing)

  async function handleFollow() {
    if (typeof isFollowing === 'undefined') {
      // user is not signed in
      signIn('google')
    } else {
      await fetch(`/api/toggleFollow/${username}`, { method: 'POST' })
      setFollowing(!following)
    }
  }

  return (
    <div className='flex items-center divide-gray-700 divide-x-2'>
      <div className='pr-2'>
        <Button color={!following && 'success'} onClick={() => handleFollow()}>
          {following ? 'Entfolgen' : 'Folgen'}
        </Button>
      </div>
      <p className='text-lg text-slate-700 pl-2'>{followerCount} Follower</p>
    </div>
  )
}
