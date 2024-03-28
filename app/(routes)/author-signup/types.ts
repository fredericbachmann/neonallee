import { userInputs } from '@/app/_types/schemas'
import { z } from 'zod'

export const authorSignupSchema = z.object({
  artistname: userInputs.artistname,
  username: userInputs.username,
})
