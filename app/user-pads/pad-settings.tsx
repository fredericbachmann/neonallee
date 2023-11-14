'use client';
import Delete from './pad/[padId]/delete';
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { HiCheck, HiOutlineCog } from "react-icons/hi";
import { useContext, useState } from 'react';
import { handleInputChange } from '@/app/user-input';
import { signIn } from 'next-auth/react';
import { PadsOnSeries } from '@prisma/client';
import { PadDetailsContext } from './card';


export function PadSettings({ pad }: {
    pad: {
        id: string
        name: string
        published: boolean
        description: string
        series: PadsOnSeries | null
    }
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
    const { updatePads } = useContext(PadDetailsContext)
    const [showCheck, setShowCheck] = useState(false)
    const [padName, setPadName] = useState(pad.name)
    const [padNameError, setPadNameError] = useState<undefined | string>()

    async function handlePadNameSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await fetch(`/api/etherpad/changePadName?padId=${pad.id}&padName=${padName}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.ok) {
            updatePads({id: pad.id, name: padName})
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

function PadDescription({ pad }: {
    pad: {
        id: string
        description: string
    }
}) {
    //TODO
}

function PublishPad({ pad }: {
    pad: {
        id: string
        published: boolean
    }
}) {
    const [published, setPublished] = useState(pad.published)
    const { updatePads } = useContext(PadDetailsContext)

    async function togglePublish() {
        const res = await fetch(`/api/etherpad/togglePublish/${pad.id}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.status === 200) {
            setPublished(!published)
            updatePads({id: pad.id, published: published})
        }
    }

    return <div>
        <ToggleSwitch checked={published} label="Text veröffentlichen" onChange={togglePublish} />
    </div>
}

