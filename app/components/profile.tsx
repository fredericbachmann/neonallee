
import { Avatar, Dropdown, Button } from 'flowbite-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Profile() {
    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === 'loading') return <Avatar rounded />

    if (session && session.user.image) return (
        <Dropdown inline label={<Avatar img={session.user.image} rounded />}>
            <Dropdown.Header>
                <p className='text-lg'>{session.user.name}</p>
                <p className='truncate'>{session.user.email}</p>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => router.push('/user-pads')}>
                meine Dokumente
            </Dropdown.Item>
            <Dropdown.Item onClick={signOut} >
                Logout
            </Dropdown.Item>
        </Dropdown>
    )

    return <Button color='success' onClick={() => signIn('google')}>Login</Button>
}