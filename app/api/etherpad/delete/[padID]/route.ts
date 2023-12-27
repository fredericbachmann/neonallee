import { NextResponse } from 'next/server'
import { auth } from '@/utils/auth'
import prisma from '@/app/db'
import { etherApiReq, getPadPermission } from '@/app/api/etherpad/etherApi'

export async function DELETE(
  _: Request,
  { params }: { params: { padId: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({}, { status: 401 })

  const permission = await getPadPermission(params.padId, session.user.id)
  if (permission !== 'OWNER') return NextResponse.json({}, { status: 403 })

  await etherApiReq('deletePad', `padID=${params.padId}`)

  await prisma.authorsOnPads.deleteMany({
    where: {
      padId: params.padId,
    },
  })

  await prisma.pad.delete({
    where: {
      id: params.padId,
    },
  })

  return NextResponse.json({}, { status: 200 })
}
