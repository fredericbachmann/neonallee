'use client'

import { Pad } from '@prisma/client'
import { Button, Table } from '@mantine/core'
import Link from 'next/link'
import { HiTrash } from 'react-icons/hi'

export function AdminTable({
  pads,
}: {
  pads: (Pad & {
    members: {
      author: {
        username: string
      }
      permission: string
    }[]
  })[]
}) {
  return (
    <Table striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Mitglieder</Table.Th>
          <Table.Th>Beschreibung</Table.Th>
          <Table.Th>Löschen</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {pads.map((pad, index) => (
          <AdminTableRow pad={pad} key={index} />
        ))}
      </Table.Tbody>
    </Table>
  )
}

function AdminTableRow({
  pad,
}: {
  pad: Pad & {
    members: {
      author: {
        username: string
      }
      permission: string
    }[]
  }
}) {
  async function handleDelete() {
    const res = await fetch(`/api/etherpad/delete/${pad.id}`, {
      method: 'DELETE',
    })
  }

  return (
    <Table.Tr>
      <Table.Td className='underline text-blue-800'>
        <Link href={`/pad/${pad.id}`} className='text-lg'>
          {pad.name}
        </Link>
      </Table.Td>
      <Table.Td>
        {pad.members.map((author, index) => (
          <div key={index} className='flex space-x-3'>
            <p>{author.author.username}</p>
            <p>{author.permission}</p>
          </div>
        ))}
      </Table.Td>
      <Table.Td>{pad.description === '' ? '---' : pad.description}</Table.Td>
      <Table.Td>
        <Button onClick={handleDelete}>
          <HiTrash />
        </Button>
      </Table.Td>
    </Table.Tr>
  )
}
