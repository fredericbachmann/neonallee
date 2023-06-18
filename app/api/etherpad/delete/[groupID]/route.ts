import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/app/db"
import { etherApiReq } from "@/app/etherApi"
import { redirect } from "next/navigation"


export async function GET(_: Request, { params }: { params: { groupID: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }
  if (!session.user || !session.user.email) {
    return NextResponse.json({ message: 'Invalid login' })
  }

  const hasAccess: boolean = !!await prisma.user.findFirst( // check if the user has access to the pad
    {
      where: {
        email: session.user.email,
        pads: {
          some: {
            pad: {
              etherGroupID: params.groupID
            }
          }
        }
      }
    }
  )
  if (!hasAccess) return NextResponse.json({ message: 'Access denied' })

  await etherApiReq('deleteGroup', `groupID=${params.groupID}`)

  const padToDelete = await prisma.pad.findUnique(
    {
      where: {
        etherGroupID: params.groupID
      }
    }
  )

  if(padToDelete) {
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

  redirect('/user-pads')
}
