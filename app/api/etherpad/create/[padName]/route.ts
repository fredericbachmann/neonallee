import { NextRequest, NextResponse } from "next/server"
import { getAuthor } from "../../get-author"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/app/db"
import { etherApiReq } from "@/app/etherApi"


export async function POST(_: NextRequest, { params }: { params: { padName: string } }) {
  const padName = params.padName ? params.padName : 'Unbenannt'

  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 401 })
  }

  const groupData = await etherApiReq('createGroup', '') // creating new group
  const groupID: string = groupData.groupID

  const author = await getAuthor()

  await etherApiReq('createGroupPad', `groupID=${groupID}&padName=${padName}&authorID=${author}`) // assigning the group a new pad

  const readOnlyData = await etherApiReq('getReadOnlyID', `padID=${groupID}$${padName}`)
  const readOnlyID: string = readOnlyData.readOnlyID

  await prisma.pad.create({
    data: {
      etherPadID: padName,
      etherGroupID: groupID,
      readOnlyID: readOnlyID,
      members: {
        create: {
          permission: "OWNER",
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

  return NextResponse.json({ url: `/pad/${groupID}/${padName}` }, { status: 200 })
}
