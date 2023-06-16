'use client'

import Profile from './profile'
import { Toolbar, AppBar, Box } from '@mui/material'
import Link from 'next/link'

interface ActionBarProps {
    children?: React.ReactNode
}

export default function ActionBar({ children }: ActionBarProps) {

    return (
        <AppBar position='sticky' color='inherit'>
            <Toolbar className='space-x-2'>
                <Link href='/' className='no-underline'>[LOGO]</Link>
                <Box sx={{ flexGrow: 1 }} />
                    {children}
                <Profile />

            </Toolbar>
        </AppBar>
    )
}