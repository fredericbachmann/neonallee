'use server'
import prisma from '@/app/_utils/db'

export async function getTags() {
  return await prisma.tag.findMany()
}

export async function addTag(tagId: string, padId: string) {
  await prisma.pad.update({
    where: { id: padId },
    data: { tags: { connect: { id: tagId } } },
  })
}

export async function removeTag(tagId: string, padId: string) {
  const res = await prisma.pad.update({
    where: { id: padId },
    data: { tags: { disconnect: { id: tagId } } },
  })
}
