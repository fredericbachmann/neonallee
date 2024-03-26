'use client'
import ActionBar from '@/app/_components/app-bar'
import { Button, Menu, Modal, TextInput } from '@mantine/core'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { HiDocumentText, HiSquare2Stack } from 'react-icons/hi2'
import { handleInputChange } from '@/app/_utils/user-input'

/** The app bar for the user-pads page */
export default function UserPadsAppBar() {
  const [openModal, setOpenModal] = useState<string | undefined>()

  return (
    <ActionBar>
      <Menu>
        <Menu.Target>
          <Button>Neu</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<HiDocumentText className='h-6 w-6' />}
            onClick={() => setOpenModal('newPad')}
          >
            Dokument
          </Menu.Item>
          <Menu.Item
            leftSection={<HiSquare2Stack className='h-6 w-6' />}
            onClick={() => setOpenModal('newRow')}
          >
            Serie
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        opened={openModal === 'newPad'}
        onClose={() => setOpenModal(undefined)}
        title='Neues Dokument'
      >
        <NewPad />
      </Modal>
      <Modal
        opened={openModal === 'newRow'}
        onClose={() => setOpenModal(undefined)}
        title='Neue Serie'
      >
        <NewRow />
      </Modal>
    </ActionBar>
  )
}

/** form inside the modal for a new pad */
function NewPad() {
  const [padName, setPadName] = useState('Unbenannt')
  const [padNameError, setPadNameError] = useState<string | undefined>()
  const router = useRouter()

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const res = await fetch(
      `/api/etherpad/create/${padName ? padName : 'Unbenannt'}`,
      { method: 'POST' }
    )
    if (res.status === 401) signIn('google')
    if (res.status === 200) {
      const json: { url: string } = await res.json()
      router.push(json.url)
    }
  }
  return (
    <form onSubmit={handleCreate}>
      <TextInput
        label='Name'
        autoFocus
        id='padName'
        value={padName}
        onChange={(e) =>
          handleInputChange(e, 'padName', setPadName, setPadNameError)
        }
        error={padNameError}
      />
      <Button type='submit'>Erstellen</Button>
    </form>
  )
}

function NewRow() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | undefined>()
  const router = useRouter()

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const res = await fetch(`/api/series?name=${value}`, { method: 'POST' })
    if (res.status === 401) signIn('google')
    if (res.status === 200) {
      router.refresh()
    }
  }
  return (
    <form onSubmit={handleCreate}>
      <TextInput
        label='Name'
        autoFocus
        id='seriesName'
        value={value}
        onChange={(e) => handleInputChange(e, 'padName', setValue, setError)} //TODO
        error={error}
      />
      <Button type='submit'>Erstellen</Button>
    </form>
  )
}
