import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/app/db"
import { etherApiReq } from "@/app/api/etherApi"


export async function DELETE(_: Request, { params }: { params: { padID: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 })
  }

  const padToDelete = await prisma.pad.findFirst({ // find the given pad (if the authenticated user has access)
    where: {
      id: params.padID,
      members: {
        some: {
          permission: "OWNER",
          author: {
            user: {
              email: session.user.email
            }
          }
        }
      }
    }
  })

  if (!padToDelete) return NextResponse.json({ message: 'Access denied' }, { status: 403 })
  await etherApiReq('deletePad', `padID=${params.padID}`)

  if (padToDelete) {
    await prisma.authorsOnPads.deleteMany({
      where: {
        padId: padToDelete.id
      }
    });

    await prisma.pad.delete({
      where: {
        id: padToDelete.id
      }
    })
  } else {
    return NextResponse.json({ message: 'Pad doesn\'t exist.' })
  }

  return NextResponse.json({ message: 'Success' }, { status: 200 })
}
