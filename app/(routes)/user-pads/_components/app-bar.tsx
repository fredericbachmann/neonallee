'use client'
import ActionBar from '@/app/_components/app-bar'
import { Button, Dropdown, Label, Modal, TextInput } from 'flowbite-react'
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
      <Dropdown label='Neu' gradientMonochrome='cyan' className='w-52'>
        <Dropdown.Item
          icon={HiDocumentText}
          className='h-12'
          onClick={() => setOpenModal('newPad')}
        >
          Dokument
        </Dropdown.Item>
        <Dropdown.Item
          icon={HiSquare2Stack}
          className='h-12'
          onClick={() => setOpenModal('newRow')}
        >
          Serie
        </Dropdown.Item>
      </Dropdown>
      <Modal
        dismissible
        show={openModal === 'newPad'}
        onClose={() => setOpenModal(undefined)}
      >
        <NewPad />
      </Modal>
      <Modal
        dismissible
        show={openModal === 'newRow'}
        onClose={() => setOpenModal(undefined)}
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
      <Modal.Header>Neues Dokument</Modal.Header>
      <Modal.Body>
        <Label htmlFor='padName' value='Name' />
        <TextInput
          autoFocus
          id='padName'
          value={padName}
          onChange={(e) =>
            handleInputChange(e, 'padName', setPadName, setPadNameError)
          }
          color={padNameError && 'failure'}
          helperText={padNameError}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type='submit'>Erstellen</Button>
      </Modal.Footer>
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
      <Modal.Header>Neue Serie</Modal.Header>
      <Modal.Body>
        <Label htmlFor='seriesName' value='Name' />
        <TextInput
          autoFocus
          id='seriesName'
          value={value}
          onChange={(e) => handleInputChange(e, 'padName', setValue, setError)} //TODO
          color={error && 'failure'}
          helperText={error}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type='submit'>Erstellen</Button>
      </Modal.Footer>
    </form>
  )
}
