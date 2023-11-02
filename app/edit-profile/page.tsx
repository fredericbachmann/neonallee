import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { prisma } from "../db"
import ActionBar from "../components/app-bar"
import { ProfileCustomization } from "./inputs"
import { redirect } from "next/navigation"

export default async function page() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/api/auth/signin')

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: session.user.id
        },
        include: {
            author: true
        }
    })

    return <>
        <ActionBar />
        <ProfileCustomization user={user} />
    </>
}