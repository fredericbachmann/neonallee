'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { _Pad } from '../../types'
import { Switch } from '@mantine/core'

export function PublishPad({ pad, setPad }: { pad: _Pad; setPad: Function }) {
  const [published, setPublished] = useState(!!pad.published)

  async function togglePublish() {
    const res = await fetch(`/api/etherpad/togglePublish/${pad.id}`, {
      method: 'POST',
    })
    if (res.status === 401) signIn('google')
    if (res.status === 200) {
      setPublished(!published)
      setPad({ ...pad, published: published })
    }
  }

  return (
    <div>
      <Switch
        checked={published}
        label='Text veröffentlichen'
        onChange={togglePublish}
      />
    </div>
  )
}
