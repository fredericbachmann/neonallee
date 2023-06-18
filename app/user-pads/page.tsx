import { getServerSession } from "next-auth";
import UserPadsAppBar from "./app-bar";
import ArticleCard from "./card";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../db";


async function getPads(): Promise<{ etherPadID: string; etherGroupID: string; }[]> {
  const session = await getServerSession(authOptions)
  if (!session) return []
  if (!session.user || !session.user.email) return []

  const pads = await prisma.pad.findMany({
    where: {
      members: {
        some: {
          user: {
            email: session.user.email
          }
        }
      }
    },
    select: {
      etherGroupID: true,
      etherPadID: true
    }
  }
  )

  return pads
}


export default async function Page() {
  return (
    <center>
      <UserPadsAppBar />
      <ArticleCard pads={await getPads()} />
    </center>
  )
}

