import { Button, ListGroup } from 'flowbite-react'
import { _Pad } from '../grid/top-level-dnd'
import { Tag } from '@prisma/client'

export function ShowTags({ pad, setPad }: { pad: _Pad; setPad: Function }) {
  return (
    <div>
      <label>Tags</label>
      <div className='flex'>
        {pad.tags.map((tag) => (
          <p>{tag.name}</p>
        ))}
      </div>
    </div>
  )
}

function EditTags({
  pad,
  setPad,
  tags,
}: {
  pad: _Pad
  setPad: Function
  tags: Tag[]
}) {
  const tagList = (
    <ListGroup>
      {tags.map((tag) => (
        <ListGroup.Item>{tag.name}</ListGroup.Item>
      ))}
    </ListGroup>
  )
  return
}
