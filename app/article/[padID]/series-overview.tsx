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
        <Link
          href={`/article/${padId}`}
          key={indexInSeries}
          className={`p-3 ${
            padId === params.padId ? 'text-green-500 cursor-default' : ''
          }`}
        >
          {indexInSeries + 1}
        </Link>
      ))}
    </div>
  )
}
