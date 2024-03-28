import { authOrRedirect } from '@/app/_utils/auth'
import ActionBar from '@/app/_components/app-bar'
import prisma from '@/app/_utils/db'
import { BecomeAuthorForm } from './form'

export default async function page() {
  const session = await authOrRedirect()

  const isAuthor = !!(await prisma.author.findUnique({
    where: {
      id: session.user.id,
    },
  }))

  return (
    <>
      <ActionBar />
      <div className='flex flex-col items-center space-y-5 p-5'>
        {isAuthor ? (
          <p className='text-4xl'>Du bist bereits ein Autor!</p>
        ) : (
          <>
            <h1 className='text-2xl font-bold'>Werde Autor*in!</h1>
            <BecomeAuthorForm />
          </>
        )}
      </div>
    </>
  )
}
