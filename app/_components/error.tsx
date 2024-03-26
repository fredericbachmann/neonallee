'use client'

import { Alert } from '@mantine/core'
import { HiExclamationTriangle } from 'react-icons/hi2'
import { useErrorContext } from './providers'

/** Error banner that sits at the root and can be shown by any component
 * -> via consuming the provider
 */
export function ErrorAlert() {
  const { error } = useErrorContext()
  return (
    <>
      {error && (
        <Alert
          className='absolute bottom-5 left-5 z-50'
          color='failure'
          icon={<HiExclamationTriangle />}
        >
          <span className='font-medium'>Ein Fehler ist aufgetreten</span>
        </Alert>
      )}
    </>
  )
}
