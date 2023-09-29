import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function Publish({padID}: {padID: string}) {
    const [openModal, setOpenModal] = useState(false)
    const router = useRouter()

    
    async function handlePublish() {
        const res = await fetch(`/api/etherpad/publish/${padID}`, { method: 'POST' })
        if (res.status === 401) router.push('/api/auth/signin')
        if (res.status === 200) setOpenModal(false)
    }
    
    return <>
        <Button onClick={() => setOpenModal(true)}>
            Veröffentlichen
        </Button>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Dokument veröffentlichen</Modal.Header>
            <Modal.Body>
                Das Dokument wird veröffentlicht, also allen zugänglich gemacht.
                Sie können es weiterhin bearbeiten.
            </Modal.Body>
            <Modal.Footer>
                <div className='flex gap-4'>
                    <Button color="success" onClick={() => handlePublish()}>Veröffentlichen!</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>Abbrechen</Button>
                </div>
            </Modal.Footer>
        </Modal>
    </>
}