import prisma from '@/utils/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { AuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const useSecureCookies = process.env.NEXTAUTH_URL!.startsWith('https://')
const cookiePrefix = useSecureCookies ? '__Secure-' : ''
const hostName = new URL(process.env.NEXTAUTH_URL!).hostname

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = user.id
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: hostName == 'localhost' ? hostName : '.' + hostName, // add a . in front so that subdomains are included
      },
    },
  },
}

export function auth() {
  return getServerSession(authOptions)
}
