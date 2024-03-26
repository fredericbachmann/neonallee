import { Alert, Button, TextInput } from '@mantine/core'
import { FormEvent, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function Share({
  members,
  updateMembers,
}: {
  members: {
    id: string
    username: string
    permission: 'OWNER' | 'READ' | 'WRITE'
    image: string | null
  }[]
  updateMembers: Function
}) {
  const { padId }: { padId: string } = useParams()

  const [permission, setPermission] = useState<'READ' | 'WRITE'>('READ')
  const [status, setStatus] = useState<number | undefined>()

  const usernameInputRef = useRef<HTMLInputElement>(null)

  async function handleShare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const username = usernameInputRef.current?.value
    const res = await fetch(
      `/api/etherpad/share/${padId}/${username}/${permission}`,
      { method: 'POST' }
    ) // call the internal api
    setStatus(res.status)
    if (res.status === 401) signIn('google')
    if (res.status === 200) {
      updateMembers(true)
      if (usernameInputRef.current) usernameInputRef.current.value = ''
    } // success, clear input field
  }

  return (
    <div className='space-y-4 pt-4'>
      <hr />
      <p className='text-lg'>Lade andere AutorInnen ein!</p>
      <form onSubmit={handleShare} className='space-y-2'>
        <div className='flex space-x-2 items-end'>
          <div className='grow'>
            <TextInput
              label='Nutzername'
              id='username'
              placeholder='HeinzHerrmann482'
              ref={usernameInputRef}
              autoComplete='off'
            />
          </div>
          <>
            <Button.Group>
              <Button
                color={permission === 'READ' ? 'blue' : 'gray'}
                onClick={() => setPermission('READ')}
              >
                Lesen
              </Button>
              <Button
                color={permission === 'WRITE' ? 'blue' : 'gray'}
                onClick={() => setPermission('WRITE')}
              >
                Schreiben
              </Button>
            </Button.Group>
          </>
        </div>
        <Button type='submit'>Freigeben</Button>
      </form>
      {status === 200 && (
        <Alert onClose={() => setStatus(undefined)} color='blue'>
          Das hat geklappt!
        </Alert>
      )}
      {status === 400 && (
        <Alert onClose={() => setStatus(undefined)} color='red'>
          Diesen Nutzernamen gibt es nicht.
        </Alert>
      )}
      {status === 403 && (
        <Alert onClose={() => setStatus(undefined)} color='red'>
          Du hast nicht die Berechtigungen dafür!
        </Alert>
      )}
    </div>
  )
}
