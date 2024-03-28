'use client'
import { useState } from 'react'
import { _Pad } from '../../types'
import { Switch } from '@mantine/core'
import togglePublishPad from './_actions/publish'

export function PublishPad({ pad }: { pad: _Pad }) {
  const [published, setPublished] = useState(!!pad.published)

  async function togglePublish() {
    await togglePublishPad(pad.id)
    setPublished(!published)
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
