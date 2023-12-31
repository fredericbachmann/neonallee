import ActionBar from '../components/app-bar'
import { Compartment } from './components'
import prisma from '../../utils/db'

export default async function Component() {
  const pads_ = await prisma.pad.findMany({
    where: {
      published: true,
    },
  })
  const pad = {
    id: 'lkdsgkdsjg',
    name: 'Titel',
    published: true,
    description: 'Beispielbeschreibung für einen Beispieltext',
  }

  const pads = [pad, pad, pad, pad, pad, pad, pad, pad, pad, pad, pad] // duplicate the pads

  return (
    <>
      <ActionBar />
      <div className='max-w-4xl mx-auto m-5'>
        <div className='grid grid-cols-3 gap-8'>
          {pads.map((pad, i) => (
            <Compartment index={i} pad={pad} key={i} />
          ))}
        </div>
      </div>
    </>
  )
}
