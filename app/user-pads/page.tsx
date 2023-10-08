import { getServerSession } from "next-auth";
import UserPadsAppBar from "./app-bar";
import AuthorPadCard from "./card";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../db";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/api/auth/signin')

  const isAuthor = !!await prisma.author.findUnique({ // checking if logged in user is marked as author
    where: {
      id: session.user.id
    }
  })
  if (!isAuthor) redirect('/becomeAuthor') // ... if not, redirect to author sign-up


  const pads = await prisma.pad.findMany({ // every pad the author has access to
    where: {
      members: {
        some: {
          authorId: session.user.id
        }
      }
    },
    select: {
      id: true,
      name: true,
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

  return (
    <center>
      <UserPadsAppBar />
      <div className="flex flex-wrap justify-center">
        {
          pads.map((pad) => {
            return <div className="p-5" key={pad.id}>
              <AuthorPadCard pad={pad} />
            </div>
          })}
      </div>
    </center>
  )
}

