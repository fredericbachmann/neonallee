import { NextRequest, NextResponse } from "next/server"
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

  const data = await etherApiReq('createAuthorIfNotExistsFor', `authorMapper=${session.user?.email}&name=${session.user?.email}`)
  const author = data.authorID

  const result = await prisma.pad.create({
    data: {
      name: padName,
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
    },
    select: {
      id: true
    }
  })

  const padId = result.id

  await etherApiReq('createPad', `padID=${padId}&authorId=${author}`) // creating a new Pad


  return NextResponse.json({ url: `/pad/${padId}` }, { status: 200 })
}
