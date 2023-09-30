import { getServerSession } from "next-auth";
import UserPadsAppBar from "./app-bar";
import ArticleCard from "./card";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../db";
import { Pad } from "@prisma/client";


async function getPads(): Promise<Pad[]> {
  const session = await getServerSession(authOptions)
  if (!session) return []

  const pads = await prisma.pad.findMany({
    where: {
      members: {
        some: {
          author: {
            id: session.user.id
          }
        }
      }
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

