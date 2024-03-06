import prisma from '@/app/_utils/db'
import { notFound } from 'next/navigation'
import { auth } from '@/app/_utils/auth'
import ActionBar from '@/app/_components/app-bar'
import { Profile } from './_components/profile'

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
      published: true,
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
      <Profile
        author={author}
        followerCount={followerCount}
        following={following}
        pads={pads}
      />
    </>
  )
}
