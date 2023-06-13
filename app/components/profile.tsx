
import { Button, IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'



export default function Profile() {
    const { data: session } = useSession()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (session && session.user && session.user.image ? (
        <div>
            <IconButton onClick={handleClick} size='small'>
                <Avatar sx={{ width: 40, height: 40 }} src={session?.user?.image} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem><Link href='/user-pads' style={{ color: 'black', textDecoration: 'none' }}>meine Dokumente</Link></MenuItem>
                <MenuItem onClick={() => { signOut(); handleClose() }}>Logout</MenuItem>
            </Menu>
        </div>
    ) : (
        <Button variant="contained" color='success' onClick={() => signIn()}>Login</Button>
    )

    )
}