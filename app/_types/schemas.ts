import { z } from 'zod'

const name = z
  .string()
  .min(4)
  .max(30)
  .regex(/^[a-zA-ZöÖüÜäÄß ]*$/, 'Nur Buchstaben und Leerzeichen erlaubt')

const city = name

const artistname = name

const username = z
  .string()
  .min(3)
  .max(15)
  .regex(/^[a-z0-9]*$/, 'Nur Kleinbuchstaben und Ziffern erlaubt')

const email = z.string().email()

const about = z.string().max(300)

const padName = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9 öÖüÜäÄß]*$/)

const seriesName = padName

export const userInputs = {
  name,
  city,
  artistname,
  username,
  email,
  about,
  padName,
  seriesName,
}
