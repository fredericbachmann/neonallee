import { prisma } from "@/app/db";
import ActionBar from "../../components/app-bar";
import { notFound } from "next/navigation";
import { ArticleAuthors } from "./author";
import { etherApiReq } from "@/app/api/etherpad/etherApi";
import { CommentSection } from "./comment";
import { auth } from "@/utils/auth";

export default async function page({ params }: { params: { padId: string } }) {
    const pad = await prisma.pad.findFirst({ // test if pad exists AND is marked as published
        where: {
            id: params.padId,
            published: true
        }
    })
    if (!pad) notFound()

    const authors = await prisma.author.findMany({
        where: {
            pads: {
                some: {
                    permission: {
                        in: ['OWNER', 'WRITE']
                    },
                    padId: params.padId
                }
            }
        },
        select: {
            username: true,
            id: true,
            user: {
                select: {
                    image: true
                }
            }
        }
    })



    const data = await etherApiReq('getHTML', `padID=${pad.id}`)
    const text: string = data.html

    const comments = await prisma.comment.findMany({
        where: {
            padId: params.padId
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const session = await auth()
    const isAdmin = !!session && !!await prisma.user.findFirst({
        where: {
            id: session.user.id,
            role: 'ADMIN'
        }
    })

    return <>
        <ActionBar />
        <div className="max-w-3xl mx-auto p-5 flex flex-col space-y-7">
            <ArticleAuthors authors={authors} />
            <div className="text-5xl font-semibold">{pad.name}</div>
            <div dangerouslySetInnerHTML={{ __html: text }} />
            <br />
            <hr />
            <CommentSection isAdmin={isAdmin} commentsProp={comments}/>
        </div>
    </>
}