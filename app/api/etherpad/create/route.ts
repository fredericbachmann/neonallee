import { NextResponse } from "next/server"
import { getAuthor } from "../get-author"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/app/db"

function generateID() { // function for creating random padID
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}


export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Not logged in' })
  }
  if (!session.user || !session.user.email) {
    return NextResponse.json({ message: 'Invalid login' })
  }

  const groupRes = await fetch(`${process.env.ETHERPAD_URL}/api/1/createGroup?apikey=${process.env.ETHERPAD_API_KEY}`) // creating new group
  if (!groupRes.ok) throw new Error('Failed to fetch data')
  const groupID = (await groupRes.json()).data.groupID

  const author = await getAuthor()

  const padID = generateID()

  const padRes = await fetch(`${process.env.ETHERPAD_URL}/api/1/createGroupPad?apikey=${process.env.ETHERPAD_API_KEY}&groupID=${groupID}&padName=${padID}&authorID=${author}`) // assigning the group a new pad
  if (!padRes.ok) throw new Error('Failed to fetch data')

  await prisma.user.upsert({
    where: {
      email: session.user.email
    },
    update: {
      groups: {
        create: {
          etherID: groupID
        }
      }
    },
    create: {
      email: session.user.email,
      groups: {
        create: {
          etherID: groupID
        }
      }
    }
  })

  return NextResponse.json({ padRoute: `${groupID}/${padID}` })
}
