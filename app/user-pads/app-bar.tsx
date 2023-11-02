'use client'
import ActionBar from "@/app/components/app-bar";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";


export default function UserPadsAppBar() {
    const [openModal, setOpenModal] = useState<string | undefined>()
    const padNameInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const padName = padNameInputRef.current?.value ? padNameInputRef.current?.value: 'Unbenannt'
        const res = await fetch(`/api/etherpad/create/${padName}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.status === 200) {
            const json: { url: string } = await res.json()
            router.push(json.url)
        }
    }

    return <ActionBar>
        <Modal dismissible show={openModal === 'padName'} onClose={() => setOpenModal(undefined)}>
            <Modal.Header>Neues Dokument</Modal.Header>
            <form onSubmit={handleCreate}>
                <Modal.Body>
                    <Label htmlFor="padName" value="Name" />
                    <TextInput id="padName" placeholder="Unbenannt" ref={padNameInputRef} />
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Erstellen</Button>
                </Modal.Footer>
            </form>
        </Modal>
        <Button onClick={() => setOpenModal('padName')}>neues Dokument</Button>
    </ActionBar>
}
