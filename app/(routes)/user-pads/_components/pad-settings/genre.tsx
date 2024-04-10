'use client'
import { Select } from '@mantine/core'
import { _Pad } from '../../types'
import { useEffect, useState } from 'react'
import { getGenreNames, updateGenre } from './_actions/genre'
import { useErrorContext } from '@/app/_components/providers'

export default function Genre({ pad }: { pad: _Pad }) {
  const errorContext = useErrorContext()
  const [genreNames, setGenreNames] = useState<string[]>([])
  // not very efficient but cleaner than prop-drilling...
  useEffect(() => {
    getGenreNames().then((_genres) => setGenreNames(_genres))
  }, [])

  async function changeGenre(value: string | null) {
    try {
      await updateGenre(pad.id, value)
    } catch (error) {
      errorContext.triggerError()
    }
  }

  return (
    <Select
      label='Genre'
      searchable
      data={genreNames}
      value={pad.genreName}
      onChange={changeGenre}
    ></Select>
  )
}
