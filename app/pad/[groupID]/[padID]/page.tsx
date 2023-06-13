
import "server-only"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAuthor } from "@/app/api/etherpad/get-author"
import { prisma } from "@/app/db"
import { getServerSession } from "next-auth"
import ActionBar from "@/app/components/app-bar"
import { Button, Stack } from "@mui/material"
import Link from "next/link"
import DeleteIcon from '@mui/icons-material/Delete'
import PadAppBar from "./app-bar"

export default async function Page({ params }: { params: { groupID: string, padID: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return <>Not logged in</>
    if (!session.user || !session.user.email) return <>Invalid login</>

    const hasAccess: boolean = !!await prisma.user.findFirst(
        {
            where: {
                email: session.user.email,
                groups: {
                    some: {
                        etherID: params.groupID
                    }
                }
            }
        }
    )

    if (!hasAccess) return <h2>You don't have access to this pad.</h2>
    const authorID: string = await getAuthor()
    const validUntil: number = Math.floor(Date.now() / 1000) + 60 * 60 * 12

    const sessionRes = await fetch(`${process.env.ETHERPAD_URL}/api/1/createSession?apikey=${process.env.ETHERPAD_API_KEY}&groupID=${params.groupID}&authorID=${authorID}&validUntil=${validUntil}`)
    if (!sessionRes.ok) {
        throw new Error('Failed to fetch data')
    }
    const sessionID = (await sessionRes.json()).data.sessionID


//TODO: man muss 1x über etherpad/auth_session connecten, bevor es in iframe klappt 
    return <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <PadAppBar />
        <div style={{ flex: 1, display: 'flex' }}>
            <iframe
                name="embed_readwrite"
                src={`http://localhost:9001/auth_session?sessionID=${sessionID}&groupID=${params.groupID}&padName=${params.padID}&showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false`}
                style={{ width: '100%' }}
            />
        </div>
    </div>
}