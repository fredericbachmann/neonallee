import { prisma } from "@/app/db";
import ActionBar from "../../components/app-bar";
import { notFound } from "next/navigation";
import { Pad } from "@prisma/client";
import { ArticleAuthors } from "./author";
import { etherApiReq } from "@/app/api/etherpad/etherApi";

export default async function page({ params }: { params: { padID: string } }) {
    const pad: Pad | null = await prisma.pad.findFirst({ // test if pad exists AND is marked as published
        where: {
            id: params.padID,
            published: true
        }
    })
    if (!pad) notFound()

    const authors = await prisma.author.findMany({
        where: {
            pads: {
                some: {
                    pad: pad
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


    return <>
        <ActionBar />
        <div className="text-5xl font-semibold">{pad.name}</div>
        <ArticleAuthors authors={authors} />
        {text}
    </>
}