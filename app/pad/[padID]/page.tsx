import "server-only"
import PadAppBar from "./app-bar"
import { prisma } from "@/app/db"
import { notFound } from 'next/navigation'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function page({ params }: { params: { padId: string } }) {
    const session = await getServerSession(authOptions)
    const pad = await prisma.pad.findUnique({
        where: {
            id: params.padId
        },
        include: {
            members: true
        }
    })


    if (!pad || // pad doesn't exist
        !session && !pad.published || // user isn't logged in and pad isn't published
        session && !pad.members.some(member => { return member.authorId === session.user.id }) // user logged in, but isn't a member of the pad
    ) notFound()

    const isOwner = !!session && pad.members.some(member => { return member.authorId === session.user.id && member.permission === 'OWNER' })

    return <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <PadAppBar isPublished={pad.published} isOwner={isOwner} />
        <div style={{ flex: 1, display: 'flex' }}>
            <iframe
                name="embed_readwrite"
                src={`http://localhost:9001/p/${params.padId}?userName=${session ? session.user.name : 'Gast'}`}
                style={{ width: '100%', border: 0 }}
            />
        </div>
    </div>
}