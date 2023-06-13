'use client'

import Profile from './profile'
import { Toolbar, AppBar, Box, Stack } from '@mui/material'
import Link from 'next/link'

interface ActionBarProps {
    children?: React.ReactNode
}

export default function ActionBar({ children }: ActionBarProps) {

    return (
        <AppBar position='sticky' color='inherit'>
            <Toolbar className='items-center' >
                <Link href='/' >[LOGO]</Link>
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction='row' spacing={2}>
                {children}
                <Profile />
                </Stack>

            </Toolbar>
        </AppBar>
    )
}