import "server-only"
import { prisma } from "@/app/db"
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PadAppBar } from "./app-bar"

export default async function page({ params }: { params: { padId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/api/auth/signin')

    const pad = await prisma.pad.findUnique({
        where: {
            id: params.padId
        },
        include: {
            members: true
        }
    })


    if (!pad || // pad doesn't exist
        !pad.members.some(member => { return member.authorId === session.user.id }) // user is not a member of this pad
    ) notFound()

    const isOwner = !!session && pad.members.some(member => { return member.authorId === session.user.id && member.permission === 'OWNER' })

    return <div className="flex flex-col h-screen">
        <PadAppBar isOwner={isOwner} pad={pad} />
        <iframe
            name="embed_readwrite"
            src={`${process.env.ETHERPAD_EXTERNAL_URL}/p/${params.padId}`}
            className="w-full flex-1"
        />
    </div>
}