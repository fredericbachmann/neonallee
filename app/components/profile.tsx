import { Dropdown, Button } from 'flowbite-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileDropdown() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading')
    return <div className='w-11 h-11 rounded-full animate-pulse bg-slate-300' />

  if (session && session.user.image)
    return (
      <Dropdown
        inline
        label=''
        renderTrigger={() => (
          <Image
            alt='profile picture'
            src={session.user.image!}
            height={44}
            width={44}
            className='rounded-full cursor-pointer'
          />
        )}
      >
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
        <Dropdown.Item onClick={signOut}>Logout</Dropdown.Item>
      </Dropdown>
    )

  return (
    <Button color='success' onClick={() => signIn('google')}>
      Login
    </Button>
  )
}
