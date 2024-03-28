import { userInputs } from '@/app/_types/schemas'
import { z } from 'zod'

export const changePadNameSchema = z.object({
  padId: z.string().cuid(),
  padName: userInputs.padName,
})
