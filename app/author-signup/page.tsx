import { getServerSession } from "next-auth";
import ActionBar from "../components/app-bar";
import { prisma } from "../db";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { BecomeAuthorForm } from "./form";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/api/auth/signin/')

    const isAuthor = !!await prisma.author.findUnique({
        where: {
            id: session.user.id
        }
    })

    return <>
        <ActionBar />
        <div className="flex flex-col items-center p-5">
            {isAuthor
                ? <p className="text-4xl">Du bist bereits ein Autor!</p>
                : <div className="text-2xl font-bold">
                    Werde ein*e Autor*in!
                    <BecomeAuthorForm />
                </div>}
        </div>
    </>
}