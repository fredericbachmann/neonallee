import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { signIn } from "next-auth/react"
import { prisma } from "../db"
import ActionBar from "../components/app-bar"
import { ProfileCustomization } from "./inputs"

export default async function page() {
    const session = await getServerSession(authOptions)
    if (!session) return signIn("google")

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