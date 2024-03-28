'use client'
import { Button, TextInput } from '@mantine/core'
import { HiCheck } from 'react-icons/hi'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { _Pad } from '../../types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { changePadNameSchema } from './_actions/types'
import { zodResolver } from '@hookform/resolvers/zod'
import changePadName from './_actions/name'

type schemaType = z.infer<typeof changePadNameSchema>

export function ChangePadName({ pad }: { pad: _Pad }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(changePadNameSchema) })

  const [showCheck, setShowCheck] = useState(false)

  async function onSubmit(data: schemaType) {
    await changePadName(data)
    setShowCheck(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex items-end'>
      <input type='hidden' {...register('padId')} value={pad.id} />
      <TextInput
        label='Name'
        {...register('padName')}
        onFocus={() => setShowCheck(true)}
        defaultValue={pad.name}
        error={errors.padId?.message}
        className='flex-1'
      />
      {showCheck && (
        <Button type='submit' variant='outline' color='green' className='ml-2'>
          <HiCheck />
        </Button>
      )}
    </form>
  )
}
