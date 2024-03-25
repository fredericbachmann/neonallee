import '../globals.css'
import { Arimo } from 'next/font/google'
import { Providers } from '@/app/_components/providers'
import { ErrorAlert } from '../_components/error'

const font = Arimo({
  subsets: ['latin'],
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
