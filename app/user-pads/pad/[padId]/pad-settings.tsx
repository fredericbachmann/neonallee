'use client';
import Delete from './delete';
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { HiCheck, HiOutlineCog } from "react-icons/hi";
import { useState } from 'react';
import { handleInputChange } from '@/app/user-input';
import { signIn } from 'next-auth/react';

export function PadSettings({ pad }: {
    pad: {
        id: string,
        name: string,
        published: boolean
    }
}) {
    const [showModal, setShowModal] = useState(false);

    function handleGearClick(e: React.MouseEvent<SVGElement, globalThis.MouseEvent>) {
        e.stopPropagation()
        setShowModal(true)
    }

    return <>
        <HiOutlineCog onClick={handleGearClick} className="h-full w-full cursor-pointer rounded-full hover:bg-slate-300" />
        <Modal show={showModal} dismissible onClose={() => setShowModal(false)}>
            <Modal.Header>
                Einstellungen
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-8">
                    <ChangePadName pad={pad} />
                    <PublishPad pad={pad} />
                    <Delete />
                </div>
            </Modal.Body>
        </Modal>
    </>;
}

function ChangePadName({ pad }: {
    pad: {
        id: string
        name: string
    }
}) {

    const [padName, setPadName] = useState(pad.name)
    const [padNameError, setPadNameError] = useState<undefined | string>()

    async function handlePadNameSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await fetch(`/api/etherpad/changePadName?padId=${pad.id}&padName=${padName}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
    }


    return <form onSubmit={handlePadNameSubmit}>
        <Label htmlFor="padName">
            Name
        </Label>
        <div className="flex items-center space-x-2">
            <TextInput
                id="padName"
                value={padName}
                onChange={(e) => handleInputChange(e, 'padName', setPadName, setPadNameError)}
                color={padNameError && 'failure'}
                helperText={padNameError}
                className="flex-1" />
            <Button type='submit' outline color='success'>
                <HiCheck />
            </Button>
        </div>
    </form>
}

function PublishPad({ pad }: {
    pad: {
        id: string
        published: boolean
    }
}) {
    const [published, setPublished] = useState(pad.published)

    async function togglePublish() {
        const res = await fetch(`/api/etherpad/togglePublish/${pad.id}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.status === 200) setPublished(!published)
    }

    return <div>
        <ToggleSwitch checked={published} label="Text veröffentlichen" onChange={togglePublish} />
    </div>
}

