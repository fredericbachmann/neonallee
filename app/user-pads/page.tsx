import { getServerSession } from "next-auth";
import UserPadsAppBar from "./app-bar";
import AuthorPadCard, { UserPadsSeries } from "./card";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../db";
import { redirect } from "next/navigation";
import { Series } from "@prisma/client";
import { HiFolder } from "react-icons/hi2";

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/api/auth/signin')

  const isAuthor = !!await prisma.author.findUnique({ // checking if logged in user is marked as author
    where: {
      id: session.user.id
    }
  })
  if (!isAuthor) redirect('/author-signup') // ... if not, redirect to author sign-up


  const series = await prisma.series.findMany({ // every series the author has access to
    where: {
      pads: {
        some: {
          pad: {
            members: {
              some: {
                authorId: session.user.id
              }
            }
          }
        }
      }
    },
    include: {
      pads: {
        include: {
          pad: true
        }
      }
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
    select: {
      id: true,
      name: true,
      published: true,
      description: true,
      members: {
        where: {
          authorId: session.user.id
        },
        select: {
          permission: true
        }
      }
    }
  }
  )

  const flattenedPads = pads.map((item) => {
    const { members, ...rest } = item // remove members property
    return {
      ...rest,
      permission: item.members[0].permission // de-nest permission of current user
    }
  })

  return (<>
    <UserPadsAppBar pads={pads} />
    <div className="flex flex-wrap justify-center">
      {
        series.map((series, index) =>
          <div key={index}>
            <UserPadsSeries series={series} />
          </div>
        )
      }
      {
        flattenedPads.map((pad) =>
          <AuthorPadCard pad={pad} key={pad.id} />
        )}
    </div>
  </>
  )
}

