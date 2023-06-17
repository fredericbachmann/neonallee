'use client'
import Profile from './profile'
import { Navbar } from 'flowbite-react'

interface ActionBarProps {
    children?: React.ReactNode
}

export default function ActionBar({ children }: ActionBarProps) {

    return (
        <Navbar fluid className='shadow'>
            <Navbar.Brand href='/'>
                [LOGO]
            </Navbar.Brand>

            <div className='flex space-x-4 items-center'>
                {children}
                <Profile />
            </div>
        </Navbar>
    )
}