import { prisma } from "@/app/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ],
    callbacks: {
      async session({ session, token, user }) {
        session.user.id = user.id
        return session
      }
    }
  }

export function auth() {
    return getServerSession(authOptions)
}