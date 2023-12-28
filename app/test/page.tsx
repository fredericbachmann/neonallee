import ActionBar from '../components/app-bar'
import { Compartment } from './components'
import prisma from '../db'

export default async function Component() {
  const pads = await prisma.pad.findMany({
    where: {
      published: true,
    },
  })

  return (
    <>
      <ActionBar />
      <div className='max-w-3xl mx-auto'>
        <div className='grid grid-cols-3 gap-4'>
          {pads.map((pad, i) => (
            <Compartment index={i} pad={pad} key={i} />
          ))}
        </div>
      </div>
    </>
  )
}
