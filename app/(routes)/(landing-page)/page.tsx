import ActionBar from '@/app/_components/app-bar'
import prisma from '@/app/_utils/db'
import { Pictures, Tags, FeaturedArtists } from './tiles'
import { Author } from '@prisma/client'

export default async function Page() {
  const featuredArtists: Author[] = await prisma.$queryRawUnsafe(
    `SELECT * FROM "Author" 
    WHERE id IN (
      SELECT "authorId" FROM "AuthorsOnPads"
      WHERE permission != 'READ' 
      AND "padId" IN (
        SELECT id FROM "Pad" WHERE published
    )) 
    ORDER BY RANDOM() LIMIT 5`
  ) // five random authors that have already published (prisma doesn't support random order)

  const tags = await prisma.tag.findMany({
    take: 10,
  })

  return (
    <div className='bg-yellow-green min-h-screen'>
      <ActionBar />
      <div className='space-y-5 select-none'>
        <Pictures />
        <Tags tags={tags} />
        <FeaturedArtists artists={featuredArtists} />
      </div>
    </div>
  )
}
