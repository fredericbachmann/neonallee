'use client';
import Delete from './pad/[padId]/delete';
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { HiCheck, HiOutlineCog } from "react-icons/hi";
import { useContext, useState } from 'react';
import { handleInputChange } from '@/app/user-input';
import { signIn } from 'next-auth/react';
import { Series } from '@prisma/client';

type _Pad = {
    id: string
    name: string
    published: boolean
    description: string
    series: Series | undefined
}

export function PadSettings({ pad: padProp, setPad: setPadProp }: {
    pad: _Pad,
    setPad?: Function
}) {
    const [state, setState] = useState(padProp)
    const [pad, setPad] = (typeof setPadProp === 'undefined'  // if state is not managed higher
        ? [state, setState]  // create new one
        : [padProp, setPadProp]  // use higher state
    )

    const [showModal, setShowModal] = useState(false);

    return <>
        <button onClick={() => setShowModal(true)} className="h-full w-full cursor-pointer" >
            <HiOutlineCog className='h-full w-full rounded-full bg-white hover:bg-gray-400' />
        </button>
        <Modal show={showModal} dismissible onClose={() => setShowModal(false)}>
            <Modal.Header>
                Einstellungen
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-8">
                    <ChangePadName pad={pad} setPad={setPad} />
                    <PublishPad pad={pad} setPad={setPad} />
                    <Delete />
                </div>
            </Modal.Body>
        </Modal>
    </>;
}

function ChangePadName({ pad, setPad }: {
    pad: _Pad,
    setPad: Function
}) {
    const [showCheck, setShowCheck] = useState(false)
    const [padName, setPadName] = useState(pad.name)
    const [padNameError, setPadNameError] = useState<undefined | string>()

    async function handlePadNameSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await fetch(`/api/etherpad/changePadName?padId=${pad.id}&padName=${padName}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.ok) {
            setPad({ ...pad, name: padName })
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
    pad: _Pad
}) {
    //TODO
}

function PublishPad({ pad, setPad }: {
    pad: _Pad,
    setPad: Function
}) {
    const [published, setPublished] = useState(pad.published)

    async function togglePublish() {
        const res = await fetch(`/api/etherpad/togglePublish/${pad.id}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.status === 200) {
            setPublished(!published)
            setPad({ ...pad, published: published })
        }
    }

    return <div>
        <ToggleSwitch checked={published} label="Text veröffentlichen" onChange={togglePublish} />
    </div>
}

