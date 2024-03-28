'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export function SeriesPagination({
  pads,
}: {
  pads: {
    padId: string
    indexInSeries: number
  }[]
}) {
  const params = useParams()

  return (
    <div className='self-center flex flex-row divide-x-2'>
      {pads.map(({ padId, indexInSeries }) => (
        <div className='p-3' key={indexInSeries}>
          {padId === params.padId ? (
            <p className='text-green-500'>{indexInSeries + 1}</p>
          ) : (
            <Link href={`/article/${padId}`}>{indexInSeries + 1}</Link>
          )}
        </div>
      ))}
    </div>
  )
}
