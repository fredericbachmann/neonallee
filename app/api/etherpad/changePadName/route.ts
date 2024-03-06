import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'
import { checkInput } from '@/app/_utils/user-input'
import { getPadPermission } from '../etherApi'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const padId = searchParams.get('padId')
  const padName = searchParams.get('padName')
  if (!(padId && padName && checkInput('padName', padName).valid)) {
    return NextResponse.json({}, { status: 400 })
  }

  const session = await auth()
  if (!session) return NextResponse.json({}, { status: 401 })

  if ((await getPadPermission(padId, session.user.id)) !== 'OWNER') {
    return NextResponse.json({}, { status: 403 })
  }

  await prisma.pad.update({
    where: {
      id: padId,
    },
    data: {
      name: padName,
    },
  })

  return NextResponse.json({}, { status: 200 })
}
