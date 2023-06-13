import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

export async function getAuthor() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: 'Not logged in' })
    }

    const res = await fetch(`${process.env.ETHERPAD_URL}/api/1/createAuthorIfNotExistsFor?apikey=${process.env.ETHERPAD_API_KEY}&authorMapper=${session.user?.email}&name=${session.user?.email}`)
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    const data = await res.json();

    return (data.data.authorID)
}