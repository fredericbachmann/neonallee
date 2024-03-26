'use client'
import { Select } from '@mantine/core'
import { _Pad } from '../../types'
import { useEffect, useState } from 'react'
import { getGenreNames, updateGenre } from '../../_server-actions/genre'
import { Genre } from '@prisma/client'
import { useErrorContext } from '@/app/_components/providers'

export default function Genre({
  pad,
  setPad,
}: {
  pad: _Pad
  setPad: Function
}) {
  const errorContext = useErrorContext()
  const [genreNames, setGenreNames] = useState<string[]>([])
  // not very efficient but cleaner than prop-drilling...
  useEffect(() => {
    getGenreNames().then((_genres) => setGenreNames(_genres))
  }, [])

  async function changeGenre(value: string | null) {
    try {
      await updateGenre(pad.id, value)
      setPad({ ...pad, genreName: value })
    } catch (error) {
      errorContext.triggerError()
    }
  }

  return (
    <Select
      searchable
      data={genreNames}
      value={pad.genreName}
      onChange={changeGenre}
    ></Select>
  )
}
