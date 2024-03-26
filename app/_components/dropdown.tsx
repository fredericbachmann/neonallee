import { Menu, Button } from '@mantine/core'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ProfileDropdown() {
  const { data: session, status } = useSession()

  if (status === 'loading')
    return <div className='w-11 h-11 rounded-full animate-pulse bg-slate-300' />

  if (session && session.user.image)
    return (
      <Menu>
        <Menu.Target>
          <Image
            alt='profile picture'
            src={session.user.image!}
            height={44}
            width={44}
            className='rounded-full cursor-pointer'
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>
            <p className='text-slate-950'>{session.user.name}</p>
            <p className='truncate text-slate-700'>{session.user.email}</p>
          </Menu.Label>
          <Menu.Item component={Link} href='/edit-profile'>
            Einstellungen
          </Menu.Item>
          <Menu.Item onClick={() => signOut()}>Logout</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )

  return (
    <Button color='green' onClick={() => signIn('google')}>
      Login
    </Button>
  )
}
