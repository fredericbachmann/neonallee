'use client'

import DeleteIcon from '@mui/icons-material/Delete'
import ActionBar from "@/app/components/app-bar"
import { Button } from "@mui/material"
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function PadAppBar() {
    const params = useParams()
    return <ActionBar>
            <Link href='/' onClick={async () => { await fetch(`/api/etherpad/delete/${params.groupID}`) }}>
                <DeleteIcon />
            </Link>
            <Button variant='contained' color='success' >Teilen</Button>
    </ActionBar>

}