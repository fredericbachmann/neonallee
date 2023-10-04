import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { FormEvent, useRef, useState } from "react";
import { useParams, useRouter } from 'next/navigation'

export default function Share({members, updateMembers}: {
    members: {
        id: string
        username: string;
        permission: 'OWNER' | 'READ' | 'WRITE';
        image: string | null;
    }[],
    updateMembers: Function
}) {
    const { padId }: { padId: string } = useParams()

    const [permission, setPermission] = useState<'READ' | 'WRITE'>('READ')
    const [status, setStatus] = useState<number | undefined>()

    const usernameInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    async function handleShare(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const username = usernameInputRef.current?.value
        const res = await fetch(`/api/etherpad/share/${padId}/${username}/${permission}`, { method: 'POST' }) // call the internal api
        setStatus(res.status)
        if (res.status === 401) router.push('/api/auth/signin')
        if (res.status === 200) {
            updateMembers(true)
            if (usernameInputRef.current) usernameInputRef.current.value = ""
        } // success, clear input field
    }

    return <>
        <form onSubmit={handleShare}>
            <Modal.Body>
                <div className="flex space-x-2">
                    <div className="grow">
                        <Label htmlFor="username" value="Nutzername" />
                        <TextInput id="usermane" name="username" placeholder="HeinzHerrmann482" ref={usernameInputRef} />
                    </div>
                    <div>
                        <br />
                        <Button.Group>
                            <Button color={permission === 'READ' ? 'blue' : 'gray'} onClick={() => setPermission('READ')}>Lesen</Button>
                            <Button color={permission === 'WRITE' ? 'blue' : 'gray'} onClick={() => setPermission('WRITE')}>Schreiben</Button>
                        </Button.Group>
                    </div>
                </div>
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
                Diesen Nutzernamen gibt es nicht.
            </Alert>
        }
        {status === 403 &&
            <Alert color="failure">
                Du hast nicht die Berechtigungen dafür!
            </Alert>
        }
    </>
}