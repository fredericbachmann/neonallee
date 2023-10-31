'use client'

import { Pad } from "@prisma/client"
import { Button, Card, Table } from "flowbite-react"
import Link from "next/link"
import { HiTrash } from "react-icons/hi"

export function AdminTable({ pads }: {
    pads: (Pad & {
        members: {
            author: {
                username: string
            },
            permission: string
        }[]
    })[]
}) {
    return <Table striped>
        <Table.Head>
            <Table.HeadCell>
                Name
            </Table.HeadCell>
            <Table.HeadCell>
                Mitglieder
            </Table.HeadCell>
            <Table.HeadCell>
                Beschreibung
            </Table.HeadCell>
            <Table.HeadCell>
                Löschen
            </Table.HeadCell>
        </Table.Head>
        <Table.Body>
            {pads.map((pad, index) =>
                <AdminTableRow pad={pad} key={index} />
            )}
        </Table.Body>
    </Table>
}

function AdminTableRow({ pad }: {
    pad: Pad & {
        members: {
            author: {
                username: string
            },
            permission: string
        }[]
    }
}) {
    async function handleDelete() {
        const res = await fetch(`/api/etherpad/delete/${pad.id}`, { method: 'DELETE' })
    }

    return <Table.Row>
        <Table.Cell className="underline text-blue-800">
            <Link href={`/pad/${pad.id}`} className="text-lg">
                {pad.name}
            </Link>
        </Table.Cell>
        <Table.Cell>
            {pad.members.map((author, index) => <div key={index} className="flex space-x-3">
                <p>{author.author.username}</p>
                <p>{author.permission}</p>
            </div>)}
        </Table.Cell>
        <Table.Cell>
            {pad.description === '' ? '---' : pad.description}
        </Table.Cell>
        <Table.Cell>
            <Button onClick={handleDelete}>
                <HiTrash />
            </Button>
        </Table.Cell>
    </Table.Row>
}