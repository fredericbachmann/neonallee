'use client'
import { Button } from "flowbite-react"
import { signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"

export default function FollowToggle({ username, isFollowing }: { username: string, isFollowing: boolean | undefined }) {
    const [following, setFollowing] = useState(isFollowing)
    const { data: session } = useSession()
    const router = useRouter()

    async function handleFollow() {
        if (session) {
            const res = await fetch(`/api/toggleFollow/${username}`, { method: 'POST' })
            setFollowing(!following)
        } else {
            signIn('google')
        }
    }

    return <Button outline color="success" onClick={() => handleFollow()}>
        {following ? "Entfolgen" : "Folgen"}
    </Button>
}
