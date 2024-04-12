import { Pad } from '@prisma/client'
import Link from 'next/link'

export function PadInList({ pad }: { pad: Pad }) {
  return (
    <Link href={`/article/${pad.id}`} key={pad.id}>
      <div className='border-highlight border-2 p-2 -mx-2 rounded-md'>
        <p className='text-2xl font-bold text-gray-800'>
          {pad.name.toUpperCase()}
        </p>
        <p className='text-gray-600 text-lg'>{pad.description}</p>
        <div className='flex items-center space-x-3'>
          {pad.genreName && <p>{pad.genreName + ' - '}</p>}
          <p className='text-sm'>
            {'veröffentlicht am ' + pad.published!.toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  )
}
