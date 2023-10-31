'use client'

import { Button, Label, TextInput } from "flowbite-react"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { checkInput } from "../input-checks"

export function BecomeAuthorForm() {
    const router = useRouter()
    const [artistname, setArtistname] = useState('')
    const [artistnameError, setArtistnameError] = useState<string | undefined>(undefined)
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState<undefined | string>()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await fetch(`/api/authorSignup?artistname=${artistname}&username=${username}`, { method: 'POST' })
        if (res.ok) router.push('/user-pads')
        if (res.status === 409) setUsernameError('Der Nutzername existiert bereits')
    }

    function handleArtistnameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const artistnameState = checkInput('artistname', e.target.value)
        if (artistnameState.valid) {
            setArtistnameError(undefined)
            setArtistname(e.target.value)
        } else setArtistnameError(artistnameState.message)
    }

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const usernameState = checkInput('username', e.target.value)
        if (usernameState.valid) {
            setUsernameError(undefined)
            setUsername(e.target.value)
        } else setUsernameError(usernameState.message)
    }


    return <form onSubmit={handleSubmit} className="w-72">
        <Label htmlFor="artistname" value="Dein Künstlername" />
        <TextInput
            id="artistname"
            name="artistname"
            required
            value={artistname}
            onChange={handleArtistnameChange}
            color={artistnameError && 'failure'}
            helperText={artistnameError}
            className="flex-1"
        />
        <Label htmlFor="username" value="Dein Nutzername" />
        <TextInput
            id="username"
            name="username"
            required
            value={username}
            onChange={handleUsernameChange}
            color={usernameError && 'failure'}
            helperText={usernameError}
        />
        <br />
        <Button type='submit'>
            Autor*in werden!
        </Button>
    </form>
}