import { authOrRedirect } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'
import ActionBar from '@/app/_components/app-bar'
import { ProfileCustomization } from './inputs'

export default async function page() {
  const session = await authOrRedirect()

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
    include: {
      author: true,
    },
  })

  return (
    <div>
      <ActionBar />
      <ProfileCustomization user={user} />
    </div>
  )
}
