import { Button, Modal } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { MdDelete } from 'react-icons/md'

export default function Delete() {
    const { padId }: { padId: string } = useParams()
    const [openModal, setOpenModal] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        const res = await fetch(`/api/etherpad/delete/${padId}`, { method: 'DELETE' })
        if (res.status === 401) signIn('google')
        if (res.status === 200) router.push('/user-pads')
    }


    return <>
        <Button onClick={() => setOpenModal(true)}>
            <MdDelete className='w-5 h-5' />
        </Button>
        <Modal dismissible show={openModal} size='md' popup onClose={() => setOpenModal(false)}>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Dokument unwiederruflich löschen?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => {
                            handleDelete()
                            setOpenModal(false)
                        }}>
                            Löschen
                        </Button>
                        <Button color="gray" onClick={() => setOpenModal(false)}>
                            Abbrechen
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    </>
}