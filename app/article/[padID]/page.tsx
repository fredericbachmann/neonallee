import { prisma } from "@/app/db";
import ActionBar from "../../components/app-bar";
import { notFound } from "next/navigation";
import { Pad } from "@prisma/client";
import { ArticleAuthors } from "./author";

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
            user: {
                select: {
                    image: true,
                    name: true
                }
            },
            username: true
        }
    })


    return <>
        <ActionBar />
        <ArticleAuthors authors={authors} />
    </>
}