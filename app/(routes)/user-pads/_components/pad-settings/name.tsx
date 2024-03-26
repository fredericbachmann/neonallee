'use client'
import { Button, TextInput } from '@mantine/core'
import { HiCheck } from 'react-icons/hi'
import { useState } from 'react'
import { handleInputChange } from '@/app/_utils/user-input'
import { signIn } from 'next-auth/react'
import { _Pad } from '../../types'

export function ChangePadName({
  pad,
  setPad,
}: {
  pad: _Pad
  setPad: Function
}) {
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
      <div className='flex items-end space-x-2'>
        <TextInput
          label='Name'
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
          error={padNameError}
          className='flex-1'
        />
        {showCheck && (
          <Button type='submit' variant='outline' color='green'>
            <HiCheck />
          </Button>
        )}
      </div>
    </form>
  )
}
