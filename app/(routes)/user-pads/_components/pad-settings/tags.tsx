import { Dropdown, ListGroup } from 'flowbite-react'
import { _Pad } from '../../types'
import { Tag } from '@prisma/client'
import { addTag, getTags, removeTag } from '../../_server-actions/tag'
import { useEffect, useState } from 'react'
import { HiCheck } from 'react-icons/hi2'
import { triggerError } from '@/app/_components/providers'

export function ShowTags({ pad, setPad }: { pad: _Pad; setPad: Function }) {
  const [allTags, setAllTags] = useState<Tag[]>([])
  // not very efficient but cleaner than prop-drilling...
  useEffect(() => {
    getTags().then((_tags) => setAllTags(_tags))
  }, [])

  async function toggleTag(tag: Tag) {
    try {
      if (pad.tags.some((_tag) => tag.id === _tag.id)) {
        await removeTag(tag.id, pad.id)
        setPad({ ...pad, tags: pad.tags.filter((el) => el.id !== tag.id) })
      } else {
        await addTag(tag.id, pad.id)
        setPad({ ...pad, tags: pad.tags.concat(tag) })
      }
    } catch (error) {
      triggerError()
    }
  }

  return (
    <div>
      <Dropdown label='Tags'>
        <ListGroup>
          {allTags.map((tag, index) => (
            <ListGroup.Item key={index} onClick={() => toggleTag(tag)}>
              <p>{tag.name}</p>
              {pad.tags.some((_tag) => tag.id === _tag.id) && <HiCheck />}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Dropdown>
    </div>
  )
}
