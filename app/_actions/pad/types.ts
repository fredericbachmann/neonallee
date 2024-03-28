import { userInputs } from '@/app/_types/schemas'
import { z } from 'zod'

export const sharePadSchema = z.object({
  padId: z.string().cuid(),
  username: userInputs.username,
  permission: z.enum(['READ', 'WRITE']),
})
