import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { prisma } from "@/app/db"
import { getPadPermission } from "@/app/api/etherpad/etherApi"

export async function POST(_: Request, { params }: { params: { padId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({}, { status: 401 })

  const permission = await getPadPermission(params.padId, session.user.id)
  if (permission !== 'OWNER') return NextResponse.json({}, { status: 403 })

  const pad = await prisma.pad.findUniqueOrThrow({
    where: {
      id: params.padId
    }
  })

  await prisma.pad.update({
    data: {
      published: !pad.published
    },
    where: {
      id: params.padId
    }
  })

  return NextResponse.json({}, { status: 200 })
}