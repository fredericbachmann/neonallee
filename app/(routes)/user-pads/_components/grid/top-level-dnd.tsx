'use client'
import { UserPadsPad } from './pad'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { UserPadsSeries } from './series'
import { _Series, _Pad } from '../../types'

export function PadsGrid({
  series,
  pads,
}: {
  series: _Series[]
  pads: _Pad[]
}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex flex-wrap justify-center'>
        {series.map((series, index) => (
          <UserPadsSeries series={series} key={index} />
        ))}
      </div>
      <div className='flex flex-wrap justify-center'>
        {pads.map((pad, index) => (
          <UserPadsPad pad={pad} key={index} />
        ))}
      </div>
    </DndProvider>
  )
}
