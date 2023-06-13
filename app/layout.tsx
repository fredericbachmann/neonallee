import './globals.css'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Providers } from './providers';


<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
  integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
  crossOrigin="anonymous"
/>

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Demo',
  description: '',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>

          <Providers>

              {children}
          </Providers>
      </body>
    </html>
  )
}
