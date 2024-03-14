import '../globals.css'
import { Roboto_Slab } from 'next/font/google'
import { Providers } from '@/app/_components/providers'
import { ErrorAlert } from '../_components/error'

const roboto = Roboto_Slab({
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
    <html lang='de' className={roboto.className}>
      <body>
        <Providers>
          {children}
          <ErrorAlert />
        </Providers>
      </body>
    </html>
  )
}
