'use client'
import { MdDelete } from 'react-icons/md'
import ActionBar from "@/app/components/app-bar"
import { useParams, useRouter } from 'next/navigation'
import { Button, Label, Modal, TextInput } from 'flowbite-react'
import { FormEvent, useRef, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function PadAppBar() {
    const params = useParams()
    const router = useRouter()
    const [openModal, setOpenModal] = useState<string | undefined>()
    const [permission, setPermission] = useState<'READ' | 'WRITE'>('READ')
    const mailInputRef = useRef<HTMLInputElement>(null)

    async function handleDelete() {
        const res = await fetch(`/api/etherpad/delete/${params.groupID}`, { method: 'DELETE' })
        if (res.status === 401) router.push('/api/auth/signin')
        if (res.status === 200) router.push('/user-pads')
    }

    async function handleShare(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const mail = mailInputRef.current?.value
        const res = await fetch(`/api/etherpad/share/${params.groupID}/${mail}/${permission}`, { method: 'POST' })
        setOpenModal(undefined)
    }

    return <ActionBar>
        <Modal dismissible show={openModal === 'share'} onClose={() => setOpenModal(undefined)}>
            <Modal.Header>Anderer Person Zugriff geben</Modal.Header>
            <form onSubmit={handleShare}>
                <Modal.Body>
                    <Label htmlFor="mail" value="E-Mail" />
                    <TextInput id="mail" name="mail" placeholder="mail@example.com" ref={mailInputRef} />
                    <Button.Group>
                        <Button color={permission === 'READ' ? 'blue' : 'gray'} onClick={() => setPermission('READ')}>Lesen</Button>
                        <Button color={permission === 'WRITE' ? 'blue' : 'gray'} onClick={() => setPermission('WRITE')}>Schreiben</Button>
                    </Button.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Freigeben</Button>
                </Modal.Footer>
            </form>
        </Modal>

        <Button onClick={() => setOpenModal('delete')}>
            <MdDelete className='w-5 h-5' />
        </Button>
        <Modal show={openModal === 'delete'} size='md' popup onClose={() => setOpenModal(undefined)}>
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
                            setOpenModal(undefined)
                        }}>
                            Löschen
                        </Button>
                        <Button color="gray" onClick={() => setOpenModal(undefined)}>
                            Abbrechen
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
        <Button onClick={() => setOpenModal('share')} color='success' >Teilen</Button>
    </ActionBar>

}