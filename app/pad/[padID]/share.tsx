import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from 'next/navigation'

export default function Share({ padID }: { padID: string }) {
    const [openModal, setOpenModal] = useState(false)
    const [permission, setPermission] = useState<'READ' | 'WRITE'>('READ')
    const [status, setStatus] = useState<number | undefined>()

    const mailInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    async function handleShare(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const mail = mailInputRef.current?.value
        const res = await fetch(`/api/etherpad/share/${padID}/${mail}/${permission}`, { method: 'POST' }) // call the internal api
        setStatus(res.status)
        if (res.status === 401) router.push('/api/auth/signin')
        if (res.status === 200 && !!mailInputRef.current) mailInputRef.current.value = "" // success, clear input field
    }

    return <>
        <Button onClick={() => setOpenModal(true)} color='success' >Teilen</Button>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Anderer Person Zugriff geben</Modal.Header>
            <form onSubmit={handleShare}>
                <Modal.Body>
                    <Label htmlFor="mail" value="E-Mail" />
                    <TextInput id="mail" name="mail" placeholder="mail@example.com" ref={mailInputRef} />
                    <br />
                    <Label value="Berechtigung" />
                    <br />
                    <Button.Group>
                        <Button color={permission === 'READ' ? 'blue' : 'gray'} onClick={() => setPermission('READ')}>Lesen</Button>
                        <Button color={permission === 'WRITE' ? 'blue' : 'gray'} onClick={() => setPermission('WRITE')}>Schreiben</Button>
                    </Button.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Freigeben</Button>
                </Modal.Footer>
            </form>

            {status === 200 &&
                <Alert color="info">
                    Das hat geklappt!
                </Alert>
            }
            {status === 400 &&
                <Alert color="failure">
                    Die Mail-Adresse ist nicht registriert, bzw. gehört nicht zu einem Autor!
                </Alert>
            }
            {status === 403 &&
                <Alert color="failure">
                    Du hast nicht die Berechtigungen dafür!
                </Alert>
            }

        </Modal>
    </>
}