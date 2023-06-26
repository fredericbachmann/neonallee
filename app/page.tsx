import 'server-only'
import ActionBar from "./components/app-bar"
import ReadArticleCard from './components/card'
import { prisma } from './db'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'


export default async function Page() {
  const session = await getServerSession(authOptions)

  if(!session || !session.user || !session.user.email) redirect('/api/auth/signin')


  const pads = await prisma.pad.findMany({
    where: {
      members: {
        some: {
          permission: 'READ',
          user: {
            email: session.user.email
          }
        }
      }
    }
  })
  console.log(pads)

  
  return (
    <center>
      <ActionBar />
      <div className="max-w-3xl">
        {
          pads.map((pad, index) =>
            <ReadArticleCard pad={pad} index={index} />
          )}
      </div>
    </center>
  )
}