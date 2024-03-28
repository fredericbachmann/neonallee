import { Alert, Button, Select, TextInput } from '@mantine/core'
import { FormEvent, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { z } from 'zod'
import { sharePadSchema } from '@/app/_actions/pad/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userInputs } from '@/app/_types/schemas'
import sharePad from '../../../_actions/share'

export default function Share({
  members,
}: {
  members: {
    id: string
    username: string
    permission: 'OWNER' | 'READ' | 'WRITE'
    image: string | null
  }[]
}) {
  const { padId }: { padId: string } = useParams()

  const [permission, setPermission] = useState<'READ' | 'WRITE'>('READ')
  const [status, setStatus] = useState<number | undefined>()
  const [usernameError, setUsernameError] = useState<string | undefined>()

  async function onSubmit(formData: FormData) {
    const parse = userInputs.username.safeParse(formData.get('username'))
    if (!parse.success)
      return setUsernameError(
        'kein gültiges Format: ' + parse.error.issues[0].message
      )
    const res = await sharePad({
      padId: padId,
      permission: permission,
      username: parse.data,
    })
    if (res === 'username-doesnt-exist') {
      return setUsernameError('Der Nutzername existiert nicht')
    }
    setUsernameError(undefined)
  }

  return (
    <div className='space-y-4 pt-4'>
      <hr />
      <p className='text-lg'>Lade andere AutorInnen ein!</p>
      <form action={onSubmit} className='space-y-2'>
        <div className='flex space-x-2 items-end'>
          <div className='grow'>
            <TextInput
              label='Nutzername'
              name='username'
              placeholder='HeinzHerrmann482'
              error={usernameError}
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
