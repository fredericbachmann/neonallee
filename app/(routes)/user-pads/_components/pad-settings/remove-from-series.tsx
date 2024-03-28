'use client'
import { Button } from '@mantine/core'
import { _Pad } from '../../types'
import { removePadFromSeries } from './_actions/series'

export function RemoveFromSeries({
  padId,
  seriesName,
}: {
  padId: string
  seriesName: string
}) {
  return (
    <Button
      onClick={() => removePadFromSeries(padId)}
      variant='outline'
      color={'gray'}
    >
      <p>Aus der Serie {seriesName} entfernen</p>
    </Button>
  )
}
