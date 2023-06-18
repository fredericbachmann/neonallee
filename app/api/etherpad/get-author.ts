import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { etherApiReq } from "@/app/etherApi"

export async function getAuthor() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: 'Not logged in' })
    }

    const data = await etherApiReq('createAuthorIfNotExistsFor', `authorMapper=${session.user?.email}&name=${session.user?.email}`)
    
    return (data.authorID)
}