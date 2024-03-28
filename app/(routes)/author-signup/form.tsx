'use client'

import { Button, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import authorSignup from './_actions/author-signup'
import { authorSignupSchema } from './types'

type schemaType = z.infer<typeof authorSignupSchema>

export function BecomeAuthorForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<schemaType>({ resolver: zodResolver(authorSignupSchema) })

  async function onSubmit(data: schemaType) {
    const res = await authorSignup(data)
    if (res === 'username-exists') {
      setError('username', { message: 'Der Nutzername existiert bereits.' })
    }
  }

  return (
    <form className='w-72' onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        {...register('artistname')}
        label='Dein Künstlername'
        error={errors.artistname?.message}
      />
      <TextInput
        {...register('username')}
        label='Dein Nutzername'
        error={errors.username?.message}
      />

      <br />
      <Button type='submit'>Autor*in werden!</Button>
    </form>
  )
}
