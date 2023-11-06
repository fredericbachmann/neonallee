'use client';
import Delete from './pad/[padId]/delete';
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { HiCheck, HiOutlineCog } from "react-icons/hi";
import { useState } from 'react';
import { handleInputChange } from '@/app/user-input';
import { signIn } from 'next-auth/react';

type UpdatePad = (name?: string, published?: boolean, description?: string) => void

export function PadSettings({ pad, updatePad }: {
    pad: {
        id: string
        name: string
        published: boolean
        description: string
    }
    updatePad?: UpdatePad
}) {
    const [showModal, setShowModal] = useState(false);

    function handleGearClick(e: React.MouseEvent<SVGElement, globalThis.MouseEvent>) {
        e.stopPropagation()
        setShowModal(true)
    }

    return <>
        <HiOutlineCog onClick={handleGearClick} className="h-full w-full cursor-pointer rounded-full bg-white hover:bg-gray-400" />
        <Modal show={showModal} dismissible onClose={() => setShowModal(false)}>
            <Modal.Header>
                Einstellungen
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-8">
                    <ChangePadName pad={pad} updatePad={updatePad} />
                    <PublishPad pad={pad} updatePad={updatePad} />
                    <Delete />
                </div>
            </Modal.Body>
        </Modal>
    </>;
}

function ChangePadName({ pad, updatePad }: {
    pad: {
        id: string
        name: string
    }
    updatePad?: UpdatePad
}) {
    const [showCheck, setShowCheck] = useState(false)
    const [padName, setPadName] = useState(pad.name)
    const [padNameError, setPadNameError] = useState<undefined | string>()

    async function handlePadNameSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await fetch(`/api/etherpad/changePadName?padId=${pad.id}&padName=${padName}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.ok) {
            if (updatePad) {
                updatePad(padName)
            }
            setShowCheck(false)
        }
    }


    return <form onSubmit={handlePadNameSubmit}>
        <Label htmlFor="padName">Name</Label>
        <div className="flex items-center space-x-2">
            <TextInput
                id="padName"
                onFocus={() => setShowCheck(true)}
                onBlur={() => { if (pad.name === padName) setShowCheck(false) }}
                value={padName}
                onChange={(e) => handleInputChange(e, 'padName', setPadName, setPadNameError)}
                color={padNameError && 'failure'}
                helperText={padNameError}
                className="flex-1" />
            {showCheck &&
                <Button type='submit' outline color='success'>
                    <HiCheck />
                </Button>}
        </div>
    </form>
}

function PadDescription({ pad, updatePad }: {
    pad: {
        id: string
        description: string
    }
    updatePad?: UpdatePad
}) {
    //TODO
}

function PublishPad({ pad, updatePad }: {
    pad: {
        id: string
        published: boolean
    }
    updatePad?: UpdatePad
}) {
    const [published, setPublished] = useState(pad.published)

    async function togglePublish() {
        const res = await fetch(`/api/etherpad/togglePublish/${pad.id}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.status === 200) {
            setPublished(!published)
            if (updatePad) {
                updatePad(undefined, published)
            }
        }
    }

    return <div>
        <ToggleSwitch checked={published} label="Text veröffentlichen" onChange={togglePublish} />
    </div>
}

