import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/app/db"
import { etherApiReq } from "@/app/api/etherpad/etherApi"


export async function POST(_: NextRequest, { params }: { params: { padName: string } }) {
  const padName = params.padName ? params.padName : 'Unbenannt'

  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({}, { status: 401 })

  const isAuthor = !!await prisma.author.findUnique({
    where: {
      id: session.user.id
    }
  })
  if (!isAuthor) return NextResponse.json({ message: 'Not an author' }, { status: 400 })


  const data = await etherApiReq('createAuthorIfNotExistsFor', `authorMapper=${session.user.id}&name=${session.user.name}`)
  const author = data.authorID

  const result = await prisma.pad.create({
    data: {
      name: padName,
      members: {
        create: {
          permission: "OWNER",
          author: {
            connect: {
              id: session.user.id
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


  return NextResponse.json({ url: `/user-pads/pad/${padId}` }, { status: 200 })
}
