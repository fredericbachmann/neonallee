import 'server-only'
import ActionBar from "./components/app-bar"
import ReadArticleCard from './components/card'
import { prisma } from './db'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'


export default async function Page() {
  const session = await getServerSession(authOptions)

  const pads = await prisma.pad.findMany({
    where: {
      published: true
    }
  })

  
  return (
    <center>
      <ActionBar />
      <div className="max-w-3xl">
        {
          pads.map((pad, index) =>
            <ReadArticleCard pad={pad} key={index} />
          )}
      </div>
    </center>
  )
}