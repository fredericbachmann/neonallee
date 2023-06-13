import { getServerSession } from "next-auth";
import UserPadsAppBar from "./app-bar";
import ArticleCard from "./card";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../db";


async function getPadIDs(): Promise<string[]> {
    const session = await getServerSession(authOptions)
    if (!session) return []
    if (!session.user || !session.user.email) return []
  
    const groups = await prisma.user.findUnique(
      {
        where: {
          email: session.user.email
        },
        select: {
          groups: true
        }
      }
    )
  
    if (!groups) return []
  
    let padIDs: string[] = []
  
    for (const group of groups.groups) {
      const res = await fetch(`${process.env.ETHERPAD_URL}/api/1/listPads?apikey=${process.env.ETHERPAD_API_KEY}&groupID=${group.etherID}`)
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await res.json()
      padIDs.push(data.data.padIDs)
    }
  
  
    return padIDs
  }


export default async function Page() {
    return (
        <center>
        <UserPadsAppBar />
        <ArticleCard padIDs={await getPadIDs()}/>
    </center>
    )
}

