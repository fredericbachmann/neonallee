'use client'
import { Button } from "flowbite-react"
import { redirect } from "next/navigation"

export default function FollowToggle({ username, loggedIn, following }: { username: string, loggedIn: boolean, following: boolean | undefined }) {
    async function handleFollow() {
        const res = await fetch(`/api/toggleFollow/${username}`, { method: 'POST' })
    }

    if (loggedIn) {
        return <Button onClick={() => handleFollow()}>
            {following?"Entfolgen":"Folgen"}
        </Button>
    } else {
        return <Button onClick={() => redirect('/api/auth/signin')}>
            Anmelden, um zu folgen
        </Button>
    }
}
