'use client'
import { Button } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { _Pad } from './pad-settings'

export function RemoveFromSeries({
  pad,
  setPad,
}: {
  pad: _Pad
  setPad: Function
}) {
  const router = useRouter()

  async function handleClick() {
    const res = await fetch(`/api/series/removePad?padId=${pad.id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setPad({ ...pad, series: undefined })
      router.refresh()
    }
  }

  if (!pad.series) return <></>
  return (
    <Button onClick={handleClick} outline color={'gray'}>
      <p>Aus der Serie {pad.series.name} entfernen</p>
    </Button>
  )
}
