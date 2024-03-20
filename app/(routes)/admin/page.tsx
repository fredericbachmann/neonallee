import { auth } from '@/app/_utils/auth'
import { notFound } from 'next/navigation'
import prisma from '@/app/_utils/db'
import ActionBar from '@/app/_components/app-bar'
import { AdminTable } from './row'

export default async function Page() {
  const session = await auth()
  if (!session) return notFound()

  const isAdmin = !!(await prisma.user.findFirst({
    where: {
      id: session.user.id,
      role: 'ADMIN',
    },
  }))
  if (!isAdmin) return notFound()

  const pads = await prisma.pad.findMany({
    include: {
      members: {
        select: {
          author: {
            select: {
              username: true,
            },
          },
          permission: true,
        },
      },
    },
  })

  return (
    <div>
      <ActionBar />
      <AdminTable pads={pads} />
    </div>
  )
}
