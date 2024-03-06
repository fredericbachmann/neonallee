'use client'

import { Author, User } from '@prisma/client'
import { Alert, Button, TextInput } from 'flowbite-react'
import Image from 'next/image'
import { useState } from 'react'
import { HiCheck, HiPencil } from 'react-icons/hi'
import { handleInputChange } from '@/app/_utils/user-input'

type Names = 'name' | 'city' | 'email' | 'username' | 'artistname' | 'about'

export function ProfileCustomization({
  user,
}: {
  user: User & { author: Author | null }
}) {
  const [focus, setFocus] = useState<undefined | string>(undefined) // defines where the text field should be shown
  const [alert, setAlert] = useState<undefined | string>(undefined)

  const rows = {
    name: { ui: 'Name', value: user.name ?? '' },
    city: { ui: 'Stadt', value: user.city ?? '' },
    email: { ui: 'E-Mail', value: user.email ?? '' },
    ...(user.author
      ? {
          username: { ui: 'Benutzername', value: user.author.username },
          artistname: { ui: 'Künstlername', value: user.author.artistname },
          about: { ui: 'Beschreibung', value: user.author.about },
        }
      : {}),
  }

  return (
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
        {Object.entries(rows).map((data, index) => (
          <Row
            key={index}
            name={data[0] as Names}
            data={data[1]}
            focus={focus}
            setFocus={setFocus}
            setAlert={setAlert}
          />
        ))}
      </div>
      {alert === 'success' && (
        <Alert
          color='success'
          onDismiss={() => setAlert(undefined)}
          className='fixed bottom-5'
        >
          <p className='text-lg'>Änderungen gespeichert!</p>
        </Alert>
      )}
      {alert === 'username-taken' && (
        <Alert
          color='failure'
          withBorderAccent
          onDismiss={() => setAlert(undefined)}
          className='fixed bottom-5'
        >
          <p>Der Benutzername ist schon vergeben. Versuche einen anderen!</p>
        </Alert>
      )}
    </div>
  )
}

function Row({
  name,
  data,
  focus,
  setFocus,
  setAlert,
}: {
  name: Names
  data: { ui: string; value: string }
  focus: string | undefined
  setFocus: Function
  setAlert: Function
}) {
  const [value, setValue] = useState(data['value'])

  function changeValue(newValue: string) {
    setValue(newValue)
    setFocus(undefined)
    setAlert('success')
  }

  return (
    <div>
      <p className=' text-slate-700'>{data['ui']}:</p>
      <div className='flex space-x-3 items-center'>
        {focus === name ? ( // wheather the edit box should be displayed
          <InputField
            name={name}
            storedValue={value}
            onSuccess={changeValue}
            setAlert={setAlert}
          />
        ) : (
          <div className='grow flex space-x-3 items-center'>
            <p className='flex-1 text-lg'>{value}</p>
            <HiPencil className='w-6 h-6' onClick={() => setFocus(name)} />
          </div>
        )}
      </div>
    </div>
  )
}

function InputField({
  name,
  storedValue,
  onSuccess,
  setAlert,
}: {
  name: Names
  storedValue: string
  onSuccess: Function
  setAlert: Function
}) {
  const [error, setError] = useState<string | undefined>(undefined)
  const [value, setValue] = useState(storedValue)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (name === 'email') {
      setValue(e.target.value)
      return
    }

    handleInputChange(e, name, setValue, setError)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newValue = value
    const res = await fetch(
      `/api/editProfile?field=${name}&value=${newValue}`,
      { method: 'POST' }
    )

    if (res.ok) {
      onSuccess(newValue)
    } else if (res.status === 409) {
      setError('Der Nutzername ist schon vergeben. Versuche einen anderen!')
    } else {
      setError('Ein unerwarteter Fehler ist aufgetreten.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='grow flex space-x-2 items-center'>
      <div className='flex-1'>
        <TextInput
          addon={name === 'username' && '@'}
          value={value}
          type={name === 'email' ? 'email' : 'text'}
          autoFocus
          required
          color={error && 'failure'}
          helperText={error}
          onChange={handleChange}
        />
      </div>
      <Button type='submit'>
        <HiCheck />
      </Button>
    </form>
  )
}
