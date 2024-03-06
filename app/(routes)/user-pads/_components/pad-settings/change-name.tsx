'use client'
import { Button, Label, TextInput } from 'flowbite-react'
import { HiCheck } from 'react-icons/hi'
import { useState } from 'react'
import { handleInputChange } from '@/app/_utils/user-input'
import { signIn } from 'next-auth/react'
import { Pad } from '@prisma/client'

export function ChangePadName({ pad, setPad }: { pad: Pad; setPad: Function }) {
  const [showCheck, setShowCheck] = useState(false)
  const [padName, setPadName] = useState(pad.name)
  const [padNameError, setPadNameError] = useState<undefined | string>()

  async function handlePadNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const res = await fetch(
      `/api/etherpad/changePadName?padId=${pad.id}&padName=${padName}`,
      { method: 'POST' }
    )
    if (res.status === 401) signIn('google')
    if (res.ok) {
      setPad({ ...pad, name: padName })
      setShowCheck(false)
    }
  }

  return (
    <form onSubmit={handlePadNameSubmit}>
      <Label htmlFor='padName'>Name</Label>
      <div className='flex items-center space-x-2'>
        <TextInput
          id='padName'
          onFocus={() => setShowCheck(true)}
          onBlur={() => {
            if (pad.name === padName) setShowCheck(false)
          }}
          value={padName}
          onChange={(e) =>
            handleInputChange(e, 'padName', setPadName, setPadNameError)
          }
          color={padNameError && 'failure'}
          helperText={padNameError}
          className='flex-1'
        />
        {showCheck && (
          <Button type='submit' outline color='success'>
            <HiCheck />
          </Button>
        )}
      </div>
    </form>
  )
}
