import { Comment } from '@prisma/client'
import { z } from 'zod'

export const writeCommentSchema = z.object({
  padId: z.string().cuid(),
  comment: z.string().min(1).max(200),
})

export type writeCommentSchemaType = z.infer<typeof writeCommentSchema>

export type _Comment = Comment & {
  user: {
    name: string | null
    image: string | null
    author: {
      username: string
    } | null
  }
}
