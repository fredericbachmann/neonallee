import prisma from '@/app/_utils/db'
import { notFound } from 'next/navigation'
import { auth } from '@/app/_utils/auth'
import ActionBar from '@/app/_components/app-bar'
import { Profile, Profile2 } from './_components/profile'

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

  const followerCount = await prisma.user.count({
    where: {
      following: {
        some: {
          id: author.id,
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
      <Profile2
        author={author}
        followerCount={followerCount}
        following={following}
        pads={pads}
      />
    </>
  )
}
