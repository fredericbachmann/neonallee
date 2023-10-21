'use client'
import ProfileDropdown from './profile'
import { Navbar, TextInput } from 'flowbite-react'

interface ActionBarProps {
    children?: React.ReactNode
}

export default function ActionBar({ children }: ActionBarProps) {

    return (
        <Navbar fluid className='shadow'>
            <Navbar.Brand href='/' className='space-x-4'>
                [LOGO]
            </Navbar.Brand>
            <div className='flex space-x-4 items-center'>
                {children}
                <ProfileDropdown />
            </div>
        </Navbar>
    )
}