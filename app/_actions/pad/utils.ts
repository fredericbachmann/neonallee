import 'server-only'
import prisma from '@/app/_utils/db'
import { revalidatePath } from 'next/cache'

export async function getPadPermission(padId: string, authorId: string) {
  const isAdmin = !!(await prisma.user.findFirst({
    where: {
      id: authorId,
      role: 'ADMIN',
    },
  }))
  if (isAdmin) return 'OWNER'

  const entry = await prisma.authorsOnPads.findUnique({
    where: {
      authorId_padId: {
        authorId: authorId,
        padId: padId,
      },
    },
  })

  if (!entry) return null
  return entry.permission
}

export async function checkIsPadOwner(padId: string, authorId: string) {
  const permission = await getPadPermission(padId, authorId)
  if (permission !== 'OWNER') throw new Error()
}

export async function etherApiReq(method: string, params: string) {
  const url = `${process.env.ETHERPAD_URL}/api/1.2.15/${method}?apikey=${process.env.ETHERPAD_API_KEY}&${params}`
  const res = await fetch(url, { cache: 'no-cache' })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch data, at ${url}, response:${JSON.stringify(res)}`
    )
  }

  const json: {
    code: number
    message: string
    data: any
  } = await res.json()

  if (json.code != 0)
    throw new Error(`Failed to fetch data at URL ${url}`, {
      cause: json.message,
    })

  return json.data
}

export function revalidatePadSettings(padId: string) {
  revalidatePath(`/user-pads/`)
  revalidatePath(`/user-pads/pad/${padId}/`)
}
