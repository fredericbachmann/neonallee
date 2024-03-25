'use client'

import { Button, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { handleInputChange } from '@/app/_utils/user-input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { userInputs } from '@/app/_types/schemas'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  artistname: userInputs.artistname,
  username: userInputs.username,
})
type schemaType = z.infer<typeof schema>

export function BecomeAuthorForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(schema) })

  // async function _handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   const res = await fetch(
  //     `/api/authorSignup?artistname=${artistname}&username=${username}`,
  //     { method: 'POST' }
  //   )
  //   if (res.ok) router.push('/user-pads')
  //   if (res.status === 409) setUsernameError('Der Nutzername existiert bereits')
  // }

  return (
    <form
      className='w-72'
      onSubmit={handleSubmit(() => {
        console.log('submitted')
      })}
    >
      <input {...register('artistname')} />
      {errors.artistname?.message && <span>{errors.artistname?.message}</span>}
      <input {...register('username')} />
      {errors.username?.message && <span>{errors.username?.message}</span>}

      <br />
      <Button type='submit'>Autor*in werden!</Button>
    </form>
  )
}
