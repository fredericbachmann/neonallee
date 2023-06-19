import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/app/db"
import { etherApiReq } from "@/app/etherApi"


export async function DELETE(_: Request, { params }: { params: { groupID: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 })
  }

  const padToDelete = await prisma.pad.findFirst({ // find the given pad (if the authenticated user has access)
    where: {
      etherGroupID: params.groupID,
      members: {
        some: {
          permission: "OWNER",
          user: {
            email: session.user.email
          }
        }
      }
    }
  })

  if (!padToDelete) return NextResponse.json({ message: 'Access denied' }, { status: 403 })

  await etherApiReq('deleteGroup', `groupID=${params.groupID}`)

  if (padToDelete) {
    await prisma.usersOnPads.deleteMany({
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
