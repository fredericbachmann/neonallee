import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/app/db"


export async function GET(_: Request, { params }: { params: { groupID: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Not logged in' })
  }
  if (!session.user || !session.user.email) {
    return NextResponse.json({ message: 'Invalid login' })
  }

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
  if (!hasAccess) return NextResponse.json({ message: 'Access denied' })

  fetch(`${process.env.ETHERPAD_URL}/api/1/deleteGroup?apikey=${process.env.ETHERPAD_API_KEY}&groupID=${params.groupID}`)

  await prisma.group.delete(
    {
      where: {
        etherID: params.groupID
      }
    }
  )

  return NextResponse.json({ message: 'Success' })
}
