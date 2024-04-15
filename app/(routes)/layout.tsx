import '../globals.css'
import { Tinos } from 'next/font/google'
import { Providers } from '@/app/_components/providers'
import { ErrorAlert } from '../_components/error'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'

const font = Tinos({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

export const metadata = {
  title: 'Literapolis',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='de' className={font.className}>
      <body>
        <Providers>
          {children}
          <ErrorAlert />
        </Providers>
      </body>
    </html>
  )
}
