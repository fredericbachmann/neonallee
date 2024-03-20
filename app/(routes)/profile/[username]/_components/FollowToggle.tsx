'use client'
import { Button } from 'flowbite-react'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function FollowToggle({
  username,
  isFollowing,
}: {
  username: string
  isFollowing: boolean | undefined
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
    <Button
      outline
      color={following ? 'light' : 'success'}
      onClick={() => handleFollow()}
    >
      {following ? 'Entfolgen' : 'Folgen'}
    </Button>
  )
}
