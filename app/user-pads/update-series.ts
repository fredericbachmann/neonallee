'use server'

import { prisma } from "../db"

type Pads = {
    padId: string
    indexInSeries: number
}[]

export async function serverEditSeries(seriesId: string, pads: Pads) {
    if (!pads.every(pad => 'padId' in pad && 'indexInSeries' in pad && typeof pad.indexInSeries === 'number')) {
        throw new Error()
    }

    await prisma.padsOnSeries.deleteMany({
        where: { seriesId: seriesId }
    })


    await prisma.series.update({
        where: { id: seriesId },
        data: {
            pads: {
                createMany: {
                    data: pads
                }
            }
        }
    })
}