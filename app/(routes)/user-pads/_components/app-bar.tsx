'use client'
import ActionBar from '@/app/_components/app-bar'
import { Button, Menu, Modal, TextInput } from '@mantine/core'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { HiDocumentText, HiSquare2Stack } from 'react-icons/hi2'
import { handleInputChange } from '@/app/_utils/user-input'
import { userInputs } from '@/app/_types/schemas'
import { createSeries } from './pad-settings/_actions/series'
import newPad from '@/app/_actions/pad/create'

/** The app bar for the user-pads page */
export default function UserPadsAppBar() {
  const [openModal, setOpenModal] = useState<string | undefined>()
  const closeModal = () => setOpenModal(undefined)

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
        <NewX name='pad' action={newPad} closeModal={closeModal} />
      </Modal>
      <Modal
        opened={openModal === 'newRow'}
        onClose={() => setOpenModal(undefined)}
        title='Neue Serie'
      >
        <NewX name='series' action={createSeries} closeModal={closeModal} />
      </Modal>
    </ActionBar>
  )
}

function NewX({
  closeModal,
  action,
  name,
}: {
  closeModal: Function
  action: Function
  name: string
}) {
  const [error, setError] = useState<string | undefined>()

  async function onSubmit(formData: FormData) {
    const parse = userInputs.seriesName.safeParse(formData.get(name))
    if (!parse.success) return setError(parse.error.issues[0].message) // client-side verification
    await action(parse.data)
    closeModal()
  }

  return (
    <form action={(data) => onSubmit(data)}>
      <TextInput label='Name' autoFocus name={name} error={error} />
      <Button type='submit'>Erstellen</Button>
    </form>
  )
}
