import { PadInList } from '@/app/_components/pad-link'
import { Pad } from '@prisma/client'
import { useEffect, useState } from 'react'
import getGenrePads from './_actions/get-genre-pads'

export default function GenreModal({ genreName }: { genreName: string }) {
  const [pads, setPads] = useState<Pad[]>()

  useEffect(() => {
    getGenrePads(genreName).then((result) => {
      setPads(result)
    })
  }, [genreName])

  if (!pads) return <p>loading...</p>
  if (pads.length === 0) return <p>Keine Artikel in diesem Genre vorhanden.</p>
  return (
    <div className='flex flex-col space-y-3'>
      <h1 className='text-lg'>Neueste Artikel</h1>
      {pads.map((pad) => (
        <PadInList pad={pad} />
      ))}
    </div>
  )
}
