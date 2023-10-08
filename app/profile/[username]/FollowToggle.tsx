'use client'
import { Button } from "flowbite-react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function FollowToggle({ username, isFollowing }: { username: string, isFollowing: boolean | undefined }) {
    const [following, setFollowing] = useState(isFollowing)
    const session = useSession()

    async function handleFollow() {
        const res = await fetch(`/api/toggleFollow/${username}`, { method: 'POST' })
        setFollowing(!following)
    }

    if (session) {
        return <Button outline color="success" onClick={() => handleFollow()}>
            {following?"Entfolgen":"Folgen"}
        </Button>
    } else {
        return <Button onClick={() => redirect('/api/auth/signin')}>
            Anmelden, um zu folgen
        </Button>
    }
}
