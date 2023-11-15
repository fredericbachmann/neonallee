import { auth } from "@/utils/auth";
import UserPadsAppBar from "./app-bar";
import { PadsGrid } from "./card";
import { prisma } from "../db";
import { redirect } from "next/navigation";


export default async function Page() {
  const session = await auth()
  if (!session) redirect('/api/auth/signin')

  const isAuthor = !!await prisma.author.findUnique({ // checking if logged in user is marked as author
    where: { id: session.user.id }
  })
  if (!isAuthor) redirect('/author-signup') // ... if not, redirect to author sign-up


  const series = await prisma.series.findMany({ // every series the author has access to
    where: {
      OR: [{
        pads: {
          some: {
            pad: {
              members: { some: { authorId: session.user.id } }
            }
          }
        }
      },
      {
        ownerId: session.user.id
      }
      ]
    },
    include: {
      pads: true
    }
  })

  const pads = await prisma.pad.findMany({ // every pad the author has access to, that is not in a series
    where: {
      series: null,
      members: {
        some: {
          authorId: session.user.id
        }
      }
    },
    select: { id: true }
  }
  )


  const padDetails = await prisma.pad.findMany({
    where: {
      members: {
        some: {
          authorId: session.user.id
        }
      }
    },
    include: {
      members: {
        select: {
          permission: true
        },
        where: {
          authorId: session.user.id
        }
      }
    }
  })

  const flattenedPadDetails = padDetails.map((item) => {
    const { members, ...rest } = item // remove members property
    return {
      ...rest,
      permission: item.members[0].permission // de-nest permission of current user
    }
  })

  return (<>
    <UserPadsAppBar />
    <PadsGrid padsWithoutSeries={pads} series={series} pads={flattenedPadDetails}/>
  </>
  )
}

