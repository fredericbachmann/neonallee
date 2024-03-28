'use server'

import { z } from 'zod'
import { authorSignupSchema } from '../types'
import { authOrRedirect } from '@/app/_utils/auth'
import prisma from '@/app/_utils/db'
import { redirect } from 'next/navigation'

export default async function authorSignup(
  values: z.infer<typeof authorSignupSchema>
) {
  const { artistname, username } = authorSignupSchema.parse(values)
  const session = await authOrRedirect()

  const usernameExists = !!(await prisma.author.findUnique({
    where: {
      username: username,
    },
  }))
  if (usernameExists) {
    return 'username-exists'
  }

  await prisma.author.create({
    data: {
      artistname: artistname,
      username: username,
      id: session.user.id,
    },
  })
  redirect('/user-pads')
}
