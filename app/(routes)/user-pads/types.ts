import { Pad, Permission, Series, Genre } from '@prisma/client'

export type _Pad = Pad & {
  members: {
    permission: Permission
  }[]
  seriesName?: string
}

export type _Series = Series & {
  pads: {
    indexInSeries: number
    pad?: _Pad
  }[]
  isOwner: boolean
}
