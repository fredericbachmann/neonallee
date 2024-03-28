'use server'
import { userInputs } from '@/app/_types/schemas'
import { FieldNames } from '../types'
import prisma from '@/app/_utils/db'
import { authOrRedirect } from '@/app/_utils/auth'
import { revalidatePath } from 'next/cache'

const userFields = ['name', 'city', 'email']
const authorFields = ['username', 'artistname', 'about']
const fields = userFields.concat(authorFields)

export async function updateProfileField(
  fieldToChange: FieldNames,
  newValue: string
) {
  const session = await authOrRedirect()
  if (!fields.includes(fieldToChange)) throw Error() // check if field is valid
  userInputs[fieldToChange].parse(newValue) // check if value is valid

  if (userFields.includes(fieldToChange)) {
    if (fieldToChange === 'email') {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          emailVerified: undefined,
        },
      })
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [fieldToChange]: newValue,
      },
    })
  } else if (authorFields.includes(fieldToChange)) {
    const isAuthor = !!(await prisma.author.findUnique({
      where: {
        id: session.user.id,
      },
    }))
    if (!isAuthor) return 'no-author'

    if (fieldToChange === 'username') {
      const userWithUsername = await prisma.author.findUnique({
        where: {
          username: newValue,
        },
      })
      if (userWithUsername && userWithUsername.id !== session.user.id) {
        return 'username-taken'
      }
    }

    await prisma.author.update({
      where: {
        id: session.user.id,
      },
      data: {
        [fieldToChange]: newValue,
      },
    })
  }
  revalidatePath('/edit-profile')
  return 'success'
}
