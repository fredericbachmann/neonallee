'use client'

import { Button, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { handleInputChange } from '@/app/_utils/user-input'

export function BecomeAuthorForm() {
  const router = useRouter()
  const [artistname, setArtistname] = useState('')
  const [artistnameError, setArtistnameError] = useState<string | undefined>(
    undefined
  )
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState<undefined | string>()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const res = await fetch(
      `/api/authorSignup?artistname=${artistname}&username=${username}`,
      { method: 'POST' }
    )
    if (res.ok) router.push('/user-pads')
    if (res.status === 409) setUsernameError('Der Nutzername existiert bereits')
  }

  return (
    <form onSubmit={handleSubmit} className='w-72'>
      <Label htmlFor='artistname' value='Dein Künstlername' />
      <TextInput
        id='artistname'
        required
        value={artistname}
        onChange={(e) =>
          handleInputChange(e, 'artistname', setArtistname, setArtistnameError)
        }
        color={artistnameError && 'failure'}
        helperText={artistnameError}
        className='flex-1'
      />
      <Label htmlFor='username' value='Dein Nutzername' />
      <TextInput
        id='username'
        required
        value={username}
        onChange={(e) =>
          handleInputChange(e, 'username', setUsername, setUsernameError)
        }
        color={usernameError && 'failure'}
        helperText={usernameError}
      />
      <br />
      <Button type='submit'>Autor*in werden!</Button>
    </form>
  )
}
