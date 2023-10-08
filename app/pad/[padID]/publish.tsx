import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { useParams, useRouter } from 'next/navigation'

export default function Publish({ isPublished }: { isPublished: Boolean }) {
    const { padId }: { padId: string } = useParams()
    const [published, setPublished] = useState<Boolean>(isPublished)
    const [openModal, setOpenModal] = useState<'publish' | 'private' | undefined>(undefined)
    const router = useRouter()


    async function togglePublish() {
        const res = await fetch(`/api/etherpad/togglePublish/${padId}`, { method: 'POST' })
        if (res.status === 401) router.push('/api/auth/signin')
        if (res.status === 200) setPublished(!published)
        setOpenModal(undefined)
    }

    return <>
        {published
            ? <Button onClick={() => setOpenModal('private')}>
                Privat stellen
            </Button>
            : <Button onClick={() => setOpenModal('publish')}>
                Veröffentlichen
            </Button>
        }
        <Modal dismissible show={openModal === 'publish'} onClose={() => setOpenModal(undefined)}>
            <Modal.Header>Dokument veröffentlichen</Modal.Header>
            <Modal.Body>
                Das Dokument wird veröffentlicht, also allen zugänglich gemacht.
                Du kannst es aber weiterhin bearbeiten.
            </Modal.Body>
            <Modal.Footer>
                <div className='flex gap-4'>
                    <Button color="success" onClick={() => togglePublish()}>Veröffentlichen!</Button>
                    <Button color="gray" onClick={() => setOpenModal(undefined)}>Abbrechen</Button>
                </div>
            </Modal.Footer>
        </Modal>
        <Modal dismissible show={openModal === 'private'} onClose={() => setOpenModal(undefined)}>
            <Modal.Header>Dokument auf Privat stellen</Modal.Header>
            <Modal.Body>
                Das Dokument wird auf 'Privat' umgestellt, 
                niemand außer den Co-AutorInnen kann es also mehr einsehen.
            </Modal.Body>
            <Modal.Footer>
                <div className='flex gap-4'>
                    <Button color="success" onClick={() => togglePublish()}>Auf Privat umstellen</Button>
                    <Button color="gray" onClick={() => setOpenModal(undefined)}>Abbrechen</Button>
                </div>
            </Modal.Footer>
        </Modal>
    </>
}