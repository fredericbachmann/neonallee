'use client'

import { MantineProvider } from '@mantine/core'
import { SessionProvider } from 'next-auth/react'
import { createContext, useContext, useState } from 'react'

const ErrorContext = createContext({
  error: false,
  triggerError: () => {},
})

export const useErrorContext = () => useContext(ErrorContext)

/** creates the provider that manages wheather the error banner should be shown */
function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState(false)

  /** Shows an error message for three seconds */
  function triggerError() {
    setError(true)
    setTimeout(() => setError(false), 3000)
  }

  return (
    <ErrorContext.Provider value={{ error: error, triggerError: triggerError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ErrorProvider>
        <MantineProvider>{children}</MantineProvider>
      </ErrorProvider>
    </SessionProvider>
  )
}
