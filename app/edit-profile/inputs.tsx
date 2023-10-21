'use client'

import { Author, User } from "@prisma/client"
import { Button, TextInput } from "flowbite-react"
import { useRef, useState } from "react"
import { HiCheck, HiPencil } from "react-icons/hi"

export function ProfileCustomization({ user }: { user: User & { author: Author | null } }) {
    const [focus, setFocus] = useState<undefined | string>(undefined) // defines where the text field should be shown

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
                <Row key={index} name={data[0]} data={data[1]} focus={focus} setFocus={setFocus} />
            )}
        </div>
    </div>
}


function Row({ name, data, focus, setFocus }: {
    name: string,
    data: { ui: string, value: string },
    focus: string | undefined,
    setFocus: Function
}) {
    const [error, setError] = useState<string | undefined>(undefined)
    const [value, setValue] = useState(data['value'])
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleChangeAttribute(field: string) {
        const newValue = inputRef.current?.value ?? ''
        const res = await fetch(`/api/editProfile?field=${field}&value=${newValue}`, { method: 'POST' })

        if (res.ok) {
            setValue(newValue)
            setFocus(undefined)
        } else {
            setError(field)
        }
    }

    return <div>
        <p className=" text-slate-700">{data['ui']}:</p>
        <div className="flex space-x-3 items-center">
            {focus === name ? // wheather the edit box should be displayed
                <div className="grow flex space-x-3 items-center">
                    <TextInput
                        className="grow"
                        autoFocus
                        defaultValue={value}
                        ref={inputRef}
                        onSubmit={() => handleChangeAttribute(name)}
                        color={error === name ? 'failure' : ''}
                    />
                    <HiCheck className="w-6 h-6" onClick={() => handleChangeAttribute(name)} />
                </div>
                :
                <div className="grow flex space-x-3 items-center">
                    <p className="grow text-lg">{value}</p>
                    <HiPencil className="w-6 h-6" onClick={() => setFocus(name)} />
                </div>
            }
        </div>
    </div>
}
