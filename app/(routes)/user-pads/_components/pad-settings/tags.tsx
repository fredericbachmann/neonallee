import { Button } from 'flowbite-react'
import { _Pad } from '../grid/top-level-dnd'

export function ShowTags({ pad, setPad }: { pad: _Pad; setPad: Function }) {
  return (
    <div>
      <label>Tags</label>
      <div className='flex'>
        {pad.tags.map((tag) => (
          <p>{tag.name}</p>
        ))}
        <button>+</button>
      </div>
    </div>
  )
}

function EditTags({ pad, setPad }: { pad: _Pad; setPad: Function }) {}
