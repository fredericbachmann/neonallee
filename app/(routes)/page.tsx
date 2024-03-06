import ActionBar from '../_components/app-bar'
import ReadArticleCard from './card'
import prisma from '../_utils/db'
export const dynamic = 'force-dynamic'

export default async function Page() {
  const pads = await prisma.pad.findMany({
    where: {
      published: true,
    },
  })

  return (
    <>
      <ActionBar />
      <br />
      <div className='flex flex-col space-y-3 max-w-3xl mx-auto'>
        {pads.map((pad, index) => (
          <ReadArticleCard pad={pad} key={index} />
        ))}
      </div>
    </>
  )
}
