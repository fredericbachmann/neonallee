import prisma from '@/app/_utils/db'

export default async function Page() {
  const pads = await prisma.pad.findMany({
    where: {
      published: true,
    },
  })

  const featuredAuthors = await prisma.$queryRawUnsafe(
    `SELECT * FROM "Author" 
    WHERE id IN (SELECT "authorId" from "AuthorsOnPads") 
    ORDER BY RANDOM() LIMIT 5`
  )

  const tags = await prisma.tag.findMany({
    take: 10,
  })

  return <></>
}
