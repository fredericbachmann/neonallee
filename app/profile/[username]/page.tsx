import { prisma } from "@/app/db"
import { notFound } from "next/navigation"
import FollowToggle from "./FollowToggle"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import ActionBar from "@/app/components/app-bar"
import ReadArticleCard from "@/app/components/card"



export default async function Page({ params }: { params: { username: string } }) {

    const author = await prisma.author.findUnique({
        where: {
            username: params.username
        },
        include: {
            user: true
        }
    })
    if (!author) notFound() // The username of the subdomain isn't registered as an author


    const pads = await prisma.pad.findMany({ // every pad the author published
        where: {
            published: true,
            members: {
                some: {
                    author: {
                        username: params.username
                    }
                }
            }
        }
    })

    const followerCount = await prisma.user.count({
        where: {
            following: {
                some: {
                    id: author.id
                }
            }
        }
    })

    const session = await getServerSession(authOptions)

    let following: boolean | undefined

    if (session) {
        following = !!await prisma.user.findFirst({
            where: {
                id: session.user.id,
                following: {
                    some: {
                        username: params.username
                    }
                }
            }
        })
    }

    return <>
        <ActionBar />
        <div className="flex flex-col space-y-8 max-w-3xl mx-auto p-5">
            <div className="grid grid-flow-col space-x-2 self-center">
                <img src={author.user.image!} className="rounded-full w-20 h-20 row-span-2 place-self-end" />
                <p className="text-3xl self-end">{author.artistname}</p>
                <p className="text-sm">@{author.username}</p>
            </div>

            <div className="flex items-center self-center divide-gray-700 divide-x-2">
                <div className="pr-2">
                    <FollowToggle username={params.username} isFollowing={following} />
                </div>
                <p className="text-lg text-slate-700 pl-2">{followerCount} Follower</p>
            </div>

            <div>
                <p className="text-2xl text-slate-700 place-self-start">Über mich:</p>
                <p>{author.about === '' ? '---' : author.about}</p>
            </div>
            {
                pads.length > 0
                    ?
                    <div className="flex flex-col space-y-2">
                        <p className="text-3xl text-slate-700">Veröffentlichte Artikel:</p>
                        {pads.map((pad, index) =>
                            <ReadArticleCard pad={pad} key={index} />
                        )}
                    </div>
                    : <>Noch keine Artikel verfasst.</>
            }
        </div>
    </>
}