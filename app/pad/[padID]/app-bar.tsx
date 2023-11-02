'use client'
import ActionBar from "@/app/components/app-bar"
import Publish from './publish'
import Delete from './delete'
import Members from "./members"
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react"
import { HiCheck, HiOutlineCog } from "react-icons/hi"
import { useState } from 'react'
import { Inputs, checkInput, handleInputChange } from "@/app/user-input"
import { useParams } from "next/navigation"
import { signIn } from "next-auth/react"

export function PadAppBar({ isPublished, isOwner, padName }: { isPublished: boolean, isOwner: boolean, padName: string }) {

    return <ActionBar>
        {isOwner &&
            <SettingsMenu padName={padName} isPublished={isPublished} />
        }
        <Members displayShare={isOwner} />
    </ActionBar>

}


function SettingsMenu({ padName, isPublished }: { padName: string, isPublished: boolean }) {
    const [showModal, setShowModal] = useState(false)

    return <>
        <HiOutlineCog onClick={() => setShowModal(true)} className="h-7 w-7 cursor-pointer rounded-full hover:bg-slate-300" />
        <Modal show={showModal} dismissible onClose={() => setShowModal(false)}>
            <Modal.Header>
                Einstellungen
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-8">
                    <ChangePadName padName={padName} />
                    <PublishPad isPublished={isPublished} />
                    <Delete />
                </div>
            </Modal.Body>
        </Modal>
    </>
}


function ChangePadName({ padName: padNameParam }: { padName: string }) {
    const { padId }: { padId: string } = useParams()

    const [padName, setPadName] = useState(padNameParam)
    const [padNameError, setPadNameError] = useState<undefined | string>()

    async function handlePadNameSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await fetch(`/api/etherpad/changePadName?padId=${padId}&padName=${padName}`, { method: 'POST' })
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
                className="flex-1"
            />
            <Button type='submit' outline color='success'>
                <HiCheck />
            </Button>
        </div>
    </form>
}

function PublishPad({ isPublished }: { isPublished: boolean }) {
    const [published, setPublished] = useState(isPublished)
    const { padId }: { padId: string } = useParams()

    async function togglePublish() {
        const res = await fetch(`/api/etherpad/togglePublish/${padId}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.status === 200) setPublished(!published)
    }

    return <div>
        <ToggleSwitch checked={published} label="Text veröffentlichen" onChange={togglePublish} />
    </div>
}