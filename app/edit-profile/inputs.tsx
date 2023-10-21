'use client'

import { Author, User } from "@prisma/client"
import { Alert, TextInput } from "flowbite-react"
import { useRef, useState } from "react"
import { HiCheck, HiPencil } from "react-icons/hi"

export function ProfileCustomization({ user }: { user: User & { author: Author | null } }) {
    const [focus, setFocus] = useState<undefined | string>(undefined) // defines where the text field should be shown
    const [alert, setAlert] = useState<undefined | string>(undefined)

    const rows = {
        name: { ui: 'Name', value: user.name ?? '' },
        city: { ui: 'Stadt', value: user.city ?? '' },
        email: { ui: 'E-Mail', value: user.email ?? '' },
        ...(user.author
            ? {
                username: { ui: 'Benutzername', value: user.author.username },
                artistname: { ui: 'Künstlername', value: user.author.artistname },
                about: { ui: 'Beschreibung', value: user.author.about },
            }
            : {})
    }


    return <div className="flex justify-center p-5">
        <div className="max-w-2xl grow flex flex-col space-y-5">
            <img src={user.image!} className="rounded-full w-36 h-36 self-center" />
            <br />
            {Object.entries(rows).map((data, index) =>
                <Row
                    key={index}
                    name={data[0]}
                    data={data[1]}
                    focus={focus}
                    setFocus={setFocus}
                    setAlert={setAlert}
                />
            )}
        </div>
        {alert === 'success' &&
            <Alert color='success' onDismiss={()=>setAlert(undefined)} className="fixed bottom-5">
                <p className="text-lg">Änderungen gespeichert!</p>
            </Alert>
        }
        {alert === 'username-taken' &&
            <Alert color='failure' withBorderAccent onDismiss={() => setAlert(undefined)} className="fixed bottom-5">
                <p>Der Benutzername ist schon vergeben. Versuche einen anderen!</p>
            </Alert>
        }
    </div>
}


function Row({ name, data, focus, setFocus, setAlert }: {
    name: string,
    data: { ui: string, value: string },
    focus: string | undefined,
    setFocus: Function,
    setAlert: Function
}) {
    const [value, setValue] = useState(data['value'])

    function changeValue(newValue: string) {
        setValue(newValue)
        setFocus(undefined)
        setAlert('success')
    }

    return <div>
        <p className=" text-slate-700">{data['ui']}:</p>
        <div className="flex space-x-3 items-center">
            {focus === name ? // wheather the edit box should be displayed
                <InputField
                    name={name}
                    value={value}
                    onSuccess={changeValue}
                    setAlert={setAlert}
                />
                :
                <div className="grow flex space-x-3 items-center">
                    <p className="flex-1 text-lg">{value}</p>
                    <HiPencil className="w-6 h-6" onClick={() => setFocus(name)} />
                </div>
            }
        </div>
    </div>
}


function InputField({ name, value, onSuccess, setAlert }: {
    name: string,
    value: string,
    onSuccess: Function,
    setAlert: Function
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | undefined>(undefined)
    async function handleChangeAttribute(field: string) {
        const newValue = inputRef.current?.value ?? ''
        const res = await fetch(`/api/editProfile?field=${field}&value=${newValue}`, { method: 'POST' })

        if (res.ok) {
            onSuccess(newValue)
        } else {
            setError(field)
            setAlert('username-taken')
        }
    }

    return <div className="grow flex space-x-3 items-center">
        <TextInput
            addon={name === 'username' && '@'}
            className="grow"
            autoFocus
            defaultValue={value}
            ref={inputRef}
            onSubmit={() => handleChangeAttribute(name)}
            color={error === name ? 'failure' : ''}
        />
        <HiCheck className="w-6 h-6" onClick={() => handleChangeAttribute(name)} />
    </div>
}
