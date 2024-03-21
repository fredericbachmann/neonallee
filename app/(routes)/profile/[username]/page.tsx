import prisma from '@/app/_utils/db'
import { notFound } from 'next/navigation'
import { auth } from '@/app/_utils/auth'
import ActionBar from '@/app/_components/app-bar'
import { Profile, Profile2 } from './_components/profile'
import { Profile3 } from './_components/profileList'

export default async function Page({
  params,
}: {
  params: { username: string }
}) {
  const author = await prisma.author.findUnique({
    where: {
      username: params.username,
    },
    include: {
      user: {
        select: { image: true },
      },
      _count: { select: { followers: true } },
    },
  })
  if (!author) notFound() // The username of the subdomain isn't registered as an author

  const pads = await prisma.pad.findMany({
    // every pad the author published
    where: {
      NOT: { published: null },
      members: {
        some: {
          author: {
            username: params.username,
          },
        },
      },
    },
  })

  const session = await auth()

  let following: boolean | undefined

  if (session) {
    following = !!(await prisma.user.findFirst({
      where: {
        id: session.user.id,
        following: {
          some: {
            username: params.username,
          },
        },
      },
    }))
  }

  return (
    <>
      <ActionBar />
      <Profile3
        artist={{ ...author, user: { image: author.user.image! } }}
        following={following}
        pads={pads}
      />
    </>
  )
}
