'use client'
import ActionBar from "@/app/components/app-bar";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

let setOpenModal = undefined

export default function UserPadsAppBar() {
    const router = useRouter();
    const [openModal, setOpenModal] = useState<string | undefined>()

    return <ActionBar>
        <Modal dismissible show={openModal === 'padName'} onClose={() => setOpenModal(undefined)}>
            <Modal.Header>Neues Dokument</Modal.Header>
            <form action="/api/etherpad/create">
                <Modal.Body>
                    <Label htmlFor="padName" value="Name" />
                    <TextInput id="padName" name="padName" placeholder="Unbenannt" />
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">Erstellen</Button>
                </Modal.Footer>
            </form>
        </Modal>
        <Button onClick={() => setOpenModal('padName')}>neues Dokument</Button>
    </ActionBar>
}
