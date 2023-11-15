import { auth } from "@/utils/auth";
import { notFound, redirect } from "next/navigation";
import { prisma } from "../db";
import ActionBar from "../components/app-bar";
import { AdminTable } from "./row";

export default async function Page() {
    const session = await auth()
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