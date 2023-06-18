
import "server-only"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAuthor } from "@/app/api/etherpad/get-author"
import { prisma } from "@/app/db"
import { getServerSession } from "next-auth"
import PadAppBar from "./app-bar"
import { etherApiReq } from "@/app/etherApi"

export default async function Page({ params }: { params: { groupID: string, padID: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return <>Not logged in</>
    if (!session.user || !session.user.email) return <>Invalid login</>

    const hasAccess: boolean = !!await prisma.user.findFirst(
        {
            where: {
                email: session.user.email,
                pads: {
                    some: {
                        pad: {
                            etherGroupID: params.groupID,
                            etherPadID: decodeURIComponent(params.padID)
                        }
                    }
                }
            }
        }
    )
    

    if (!hasAccess) return <h2>You don't have access to this pad.</h2>
    const authorID: string = await getAuthor()
    const validUntil: number = Math.floor(Date.now() / 1000) + 60 * 60 * 12

    const sessionID: string = (await etherApiReq('createSession', `groupID=${params.groupID}&authorID=${authorID}&validUntil=${validUntil}`)).sessionID


    return <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <PadAppBar />
        <div style={{ flex: 1, display: 'flex' }}>
            <iframe
                name="embed_readwrite"
                src={`http://localhost:9001/auth_session?sessionID=${sessionID}&groupID=${params.groupID}&padName=${params.padID}&showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false`}
                style={{ width: '100%', border: 0 }}
            />
        </div>
    </div>
}