'use client'
import { Button } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { _Pad } from '../grid/top-level-dnd'

export function RemoveFromSeries({
  padId,
  seriesName,
}: {
  padId: string
  seriesName: string
}) {
  const router = useRouter()

  async function handleClick() {
    const res = await fetch(`/api/series/removePad?padId=${padId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <Button onClick={handleClick} outline color={'gray'}>
      <p>Aus der Serie {seriesName} entfernen</p>
    </Button>
  )
}
