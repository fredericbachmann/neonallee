import prisma from '@/app/_utils/db'

export async function etherApiReq(method: string, params: string) {
  const url = `${process.env.ETHERPAD_URL}/api/1.2.15/${method}?apikey=${process.env.ETHERPAD_API_KEY}&${params}`
  const res = await fetch(url, { cache: 'no-cache' })
  if (!res.ok)
    throw new Error(`Failed to fetch data, response: ${JSON.stringify(res)}
  Request URL was: ${url}
  `)

  const json: {
    code: number
    message: string
    data: any
  } = await res.json()

  if (json.code != 0)
    throw new Error(
      `Failed to fetch data at URL ${url}, response: ${JSON.stringify(json)}`
    )

  return json.data
}

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
