import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { prisma } from "../db";
import ActionBar from "../components/app-bar";
import { AdminTable } from "./row";

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/api/auth/signin/')

    const isAdmin = !!await prisma.user.findFirst({
        where: {
            id: session.user.id,
            role: 'ADMIN'
        }
    })
    if (!isAdmin) return notFound()

    const pads = await prisma.pad.findMany({
        include: {
            members: {
                select: {
                    author: {
                        select: {
                            username: true
                        }
                    },
                    permission: true
                }
            }
        }
    })

    return <div>
        <ActionBar />
        <AdminTable pads={pads} />
    </div>
}