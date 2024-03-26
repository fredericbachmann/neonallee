import { Button, Modal } from '@mantine/core'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function Delete({ padId }: { padId: string }) {
  const [openModal, setOpenModal] = useState(false)
  const router = useRouter()
  async function handleDelete() {
    console.log(padId)
    const res = await fetch(`/api/etherpad/delete/${padId}`, {
      method: 'DELETE',
    })
    if (res.status === 401) signIn('google')
    if (res.status === 200) router.push('/user-pads')
  }

  return (
    <>
      <Button variant='outline' color='red' onClick={() => setOpenModal(true)}>
        Dieses Dokument löschen
      </Button>
      <Modal
        opened={openModal}
        size='md'
        onClose={() => setOpenModal(false)}
        centered
      >
        <div className='text-center'>
          <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
          <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
            Dokument unwiederruflich löschen?
          </h3>
          <div className='flex justify-center gap-4'>
            <Button
              color='red'
              onClick={() => {
                handleDelete()
                setOpenModal(false)
              }}
            >
              Löschen
            </Button>
            <Button color='gray' onClick={() => setOpenModal(false)}>
              Abbrechen
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
