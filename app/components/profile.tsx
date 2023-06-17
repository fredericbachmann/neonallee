
import { Avatar, Dropdown, Button } from 'flowbite-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

export default function Profile() {
    const { data: session } = useSession()
   
    return (session && session.user && session.user.image ? (
        <div>
        <Dropdown inline label={<Avatar img={session.user.image} rounded />}>
            <Dropdown.Header>
                <span className='block'>{session.user.name}</span>
                <span className='block truncate'>{session.user.email}</span>
            </Dropdown.Header>
            <Dropdown.Item>
                <Link href='/user-pads' >meine Dokumente</Link>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { signOut(); }} >
                Logout
            </Dropdown.Item>
        </Dropdown>
        </div>
    ) : (
        <Button color='success' onClick={() => signIn()}>Login</Button>
    )

    )
}