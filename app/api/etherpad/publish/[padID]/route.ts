import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { prisma } from "@/app/db"

export async function POST(_: Request, { params }: { params: { padID: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 })
  }

  const hasPermission: boolean = !!await prisma.pad.findFirst({
    where: {
      id: params.padID,
      members: {
        some: {
          permission: 'OWNER',
          author: {
            id: session.user.id
          }
        }
      }
    }
  })

  if (!hasPermission) return NextResponse.json({ message: 'No permission' }, { status: 405 })

  await prisma.pad.update({
    data: {
      published: true
    },
    where: {
      id: params.padID
    }
  })

  return NextResponse.json({ message: 'ok' }, { status: 200 })
}