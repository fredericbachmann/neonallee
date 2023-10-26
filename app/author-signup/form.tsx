'use client'

import { Button, Label, TextInput } from "flowbite-react"
import { useRouter } from 'next/navigation'

export function BecomeAuthorForm() {
    const router = useRouter()
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const res = await fetch(`/api/authorSignup?artistname=${form.artistname.value}&username=${form.username.value}`, { method: 'POST' })
        if(res.ok) router.push('/user-pads')
    }
    return <form onSubmit={handleSubmit}>
        <Label htmlFor="artistname" value="Dein Künstlername" />
        <TextInput id="artistname" name="artistname" required />
        <Label htmlFor="username" value="Dein Nutzername" />
        <TextInput id="username" name="username" required />
        <br />
        <Button type='submit'>
            Autor*in werden!
        </Button>
    </form>
}