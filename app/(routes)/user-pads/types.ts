import { Pad, Permission, Tag, Series } from '@prisma/client'

export type _Pad = Pad & {
  members: {
    permission: Permission
  }[]
  seriesName?: string
  tags: Tag[]
}

export type _Series = Series & {
  pads: {
    indexInSeries: number
    pad?: _Pad
  }[]
  isOwner: boolean
}
