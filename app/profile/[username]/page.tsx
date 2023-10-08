import { prisma } from "@/app/db"
import { Author } from "@prisma/client"
import { notFound } from "next/navigation"
import FollowToggle from "./FollowToggle"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import ActionBar from "@/app/components/app-bar"
import ReadArticleCard from "@/app/components/card"
import UserAvatar from "./avatar"



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


    return <>
        <ActionBar />
        <br />
        <div className="flex flex-col items-center space-y-4">
            <div className="grid grid-rows-2 grid-flow-col space-x-2">
                <div className="row-span-2">
                    <UserAvatar img={author.user.image!} />
                </div>
                <p className="text-3xl place-self-end">{author.artistname}</p>
                <p className="text-sm place-self-start">@{author.username}</p>
            </div>
            <FollowToggle username={params.username} isFollowing={following} />
            {
                pads.length > 0
                    ?
                    <div className="max-w-3xl">
                        {pads.map((pad, index) =>
                            <ReadArticleCard pad={pad} key={index} />
                        )}
                    </div>
                    : <>Noch keine Artikel verfasst.</>
            }
        </div>
    </>
}