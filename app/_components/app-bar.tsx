'use client'
import Link from 'next/link'
import ProfileDropdown from './dropdown'
import { Navbar } from 'flowbite-react'

export default function ActionBar({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <Navbar fluid className='shadow bg-inherit'>
      <Navbar.Brand as={Link} href='/'>
        [LOGO]
      </Navbar.Brand>
      <div className='flex md:order-2'>
        <ProfileDropdown />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href='/user-pads'>Dokumente</Navbar.Link>
        {children}
      </Navbar.Collapse>
    </Navbar>
  )
}
