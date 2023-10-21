
import { Avatar, Dropdown, Button } from 'flowbite-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileDropdown() {
    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === 'loading') return <Avatar rounded />

    if (session && session.user.image) return (
        <Dropdown inline label={<Avatar img={session.user.image} rounded />}>
            <Dropdown.Header>
                <p className='text-slate-950'>{session.user.name}</p>
                <p className='truncate text-slate-700'>{session.user.email}</p>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => router.push('/user-pads')}>
                Meine Dokumente
            </Dropdown.Item>
            <Dropdown.Item onClick={() => router.push('/edit-profile')}>
                Profil Einstellungen
            </Dropdown.Item>
            <Dropdown.Item onClick={signOut} >
                Logout
            </Dropdown.Item>
        </Dropdown>
    )

    return <Button color='success' onClick={() => signIn('google')}>Login</Button>
}