import { NextRequest, NextResponse } from "next/server"
import { getAuthor } from "../get-author"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/app/db"
import { redirect } from "next/navigation"
import { etherApiReq } from "@/app/etherApi"


export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get('padName') ?? 'Unbenannt'
  const padName = param ? param : 'Unbenannt'

  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Not logged in' })
  }
  if (!session.user || !session.user.email) {
    return NextResponse.json({ message: 'Invalid login' })
  }

  const groupData = await etherApiReq('createGroup', '') // creating new group
  const groupID = groupData.groupID

  const author = await getAuthor()

  await etherApiReq('createGroupPad', `groupID=${groupID}&padName=${padName}&authorID=${author}`) // assigning the group a new pad

  await prisma.pad.create({
    data: {
      etherPadID: padName,
      etherGroupID: groupID,
      members: {
        create: {
          user: {
            connectOrCreate: {
              where: {
                email: session.user.email
              },
              create: {
                email: session.user.email
              }
            }
          }
        }
      }
    }
  })

  redirect(`/pad/${groupID}/${padName}`)
}
