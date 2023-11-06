'use client'
import ActionBar from '@/app/components/app-bar';
import { Button, Dropdown, Label, Modal, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { HiDocumentText, HiMinus, HiOutlineXCircle, HiPlus, HiSquare2Stack, HiXCircle } from "react-icons/hi2";
import { handleInputChange } from '../user-input';
import { List, arrayMove } from 'react-movable';


export default function UserPadsAppBar({ pads }: {
    pads: {
        id: string
        name: string
    }[]
}) {
    const [openModal, setOpenModal] = useState<string | undefined>()

    return <ActionBar>
        <Dropdown label='Neu' gradientMonochrome='cyan' className='w-52'>
            <Dropdown.Item icon={HiDocumentText} className='h-12' onClick={() => setOpenModal('newPad')}>Dokument</Dropdown.Item>
            <Dropdown.Item icon={HiSquare2Stack} className='h-12' onClick={() => setOpenModal('newRow')}>Reihe</Dropdown.Item>
        </Dropdown>
        <Modal dismissible show={openModal === 'newPad'} onClose={() => setOpenModal(undefined)}>
            <NewPad />
        </Modal>
        <Modal dismissible show={openModal === 'newRow'} onClose={() => setOpenModal(undefined)}>
            <NewRow pads={pads} />
        </Modal>
    </ActionBar>
}


function NewPad() {
    const [padName, setPadName] = useState('Unbenannt')
    const [padNameError, setPadNameError] = useState<string | undefined>()
    const router = useRouter()

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const res = await fetch(`/api/etherpad/create/${padName ? padName : 'Unbenannt'}`, { method: 'POST' })
        if (res.status === 401) signIn('google')
        if (res.status === 200) {
            const json: { url: string } = await res.json()
            router.push(json.url)
        }
    }
    return <form onSubmit={handleCreate}>
        <Modal.Header>Neues Dokument</Modal.Header>
        <Modal.Body>
            <Label htmlFor="padName" value="Name" />
            <TextInput
                autoFocus
                id="padName"
                value={padName}
                onChange={(e) => handleInputChange(e, 'padName', setPadName, setPadNameError)}
                color={padNameError && 'failure'}
                helperText={padNameError}
            />
        </Modal.Body>
        <Modal.Footer>
            <Button type="submit">Erstellen</Button>
        </Modal.Footer>
    </form>
}


function NewRow({ pads }: {
    pads: {
        id: string
        name: string
    }[]
}) {
    const [notIncludedPads, setNotIncludedPads] = useState(pads)
    const [includedPads, setIncludedPads] = useState<{ id: string, name: string }[]>([])

    return <div>
        <Modal.Header>Neue Serie</Modal.Header>
        <Modal.Body>
            <List
                transitionDuration={0}
                values={includedPads}
                onChange={({ oldIndex, newIndex }) => setIncludedPads(arrayMove(includedPads, oldIndex, newIndex))}
                renderList={({ children, props }) => <div {...props}>{children}</div>}
                renderItem={({ value, props }) =>
                    <div {...props} key={value.id} className='flex items-center p-3 m-2 border-2 rounded-lg border-gray-500 z-50 list-none'>
                        <p className='flex-1'>{value.name}</p>
                        <button><HiOutlineXCircle className='h-8 w-8' onClick={(e) => {
                            setIncludedPads(includedPads.filter(pad => pad !== value))
                            setNotIncludedPads([...notIncludedPads, value])
                        }} /></button>

                    </div>}
            />
            <br />
            <p className='text-lg text-gray-600'>Dokumente hinzufügen:</p>
            {notIncludedPads.map((value, index) =>
                <div key={index} className='m-2 border-2 rounded-lg border-gray-500'>
                    <button className='p-3 w-full flex items-center justify-between' onClick={() => {
                        setNotIncludedPads(notIncludedPads.filter(pad => pad !== value))
                        setIncludedPads([...includedPads, value])
                    }}>
                            <p className=''>{value.name}</p>
                            <HiPlus className='h-8 w-8' />
                    </button>
                </div>
            )}
        </Modal.Body>
    </div>
}