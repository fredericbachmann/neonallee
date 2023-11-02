import './globals.css'
import { Providers } from './providers';
import { Roboto_Slab } from 'next/font/google'

const roboto = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: 'Demo',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={roboto.className}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
