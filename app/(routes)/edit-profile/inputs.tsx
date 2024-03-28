'use client'

import { Author, User } from '@prisma/client'
import { Alert, Button, TextInput } from '@mantine/core'
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { HiCheck, HiPencil } from 'react-icons/hi'
import { z } from 'zod'
import { FieldNames } from './types'
import { userInputs } from '@/app/_types/schemas'
import { updateProfileField } from './_actions/action'

type RowType = {
  name: FieldNames
  ui: string
  value: string
  schema: z.Schema
}

export function ProfileCustomization({
  user,
}: {
  user: User & { author: Author | null }
}) {
  const [focus, setFocus] = useState<undefined | string>(undefined) // defines where the text field should be shown
  const [alert, setAlert] = useState<undefined | string>(undefined)

  const rows: RowType[] = [
    {
      name: 'name',
      ui: 'Name',
      value: user.name ?? '',
      schema: userInputs.name,
    },
    { name: 'city', ui: 'Stadt', value: user.city, schema: userInputs.city },
    {
      name: 'email',
      ui: 'E-Mail',
      value: user.email ?? '',
      schema: userInputs.email,
    },
  ]
  if (user.author) {
    rows.push(
      {
        name: 'username',
        ui: 'Benutzername',
        value: user.author.username,
        schema: userInputs.username,
      },
      {
        name: 'artistname',
        ui: 'Künstlername',
        value: user.author.artistname,
        schema: userInputs.artistname,
      },
      {
        name: 'about',
        ui: 'Beschreibung',
        value: user.author.about,
        schema: userInputs.about,
      }
    )
  }

  return (
    <>
      <div className='flex justify-center p-5'>
        <div className='max-w-2xl grow flex flex-col space-y-5'>
          <Image
            alt='profile picture'
            src={user.image!}
            height={144}
            width={144}
            className='rounded-full self-center'
          />
          <br />
          {rows.map((row, index) => (
            <Row
              key={index}
              data={row}
              focus={focus}
              setFocus={setFocus}
              setAlert={setAlert}
            />
          ))}
        </div>
      </div>
      <div className='absolute bottom-5'>
        {alert === 'success' && (
          <Alert color='green' onClose={() => setAlert(undefined)}>
            <p className='text-lg'>Änderungen gespeichert!</p>
          </Alert>
        )}
        {alert === 'username-taken' && (
          <Alert color='red' onClose={() => setAlert(undefined)}>
            <p>Der Benutzername ist schon vergeben. Versuche einen anderen!</p>
          </Alert>
        )}
      </div>
    </>
  )
}

function Row({
  data,
  focus,
  setFocus,
  setAlert,
}: {
  data: RowType
  focus: string | undefined
  setFocus: Function
  setAlert: Function
}) {
  const [error, setError] = useState<undefined | string>()

  async function onSubmit(formData: FormData) {
    const parse = data.schema.safeParse(formData.get(data.name))
    if (!parse.success) return setError(parse.error.issues[0].message) // client-side verification
    const res = await updateProfileField(data.name, parse.data)
    setAlert(res)
    if (res === 'success') setFocus()
  }

  return (
    <div>
      <p className='text-slate-700'>{data.ui}:</p>
      <div className='flex space-x-3 items-center'>
        {focus === data.name ? ( // wheather the edit box should be displayed
          <form className='grow flex space-x-2 items-center' action={onSubmit}>
            <div className='flex-1'>
              <TextInput
                defaultValue={data.value}
                error={error}
                name={data.name}
              />
            </div>
            <Button type='submit'>
              <HiCheck />
            </Button>
          </form>
        ) : (
          <div className='grow flex space-x-3 items-center'>
            <p className='flex-1 text-lg'>{data.value}</p>
            <HiPencil className='w-6 h-6' onClick={() => setFocus(data.name)} />
          </div>
        )}
      </div>
    </div>
  )
}
