import type { Metadata }  from 'next'
import { Providers }      from './providers'
import { Navbar }         from '@/components/layout/Navbar'
import { Footer }         from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title:       'Okkult Protocol',
  description: 'Zero-knowledge privacy infrastructure for Ethereum. Prove everything. Reveal nothing.',
  metadataBase: new URL('https://okkult.io'),
  openGraph: {
    title:       'Okkult Protocol',
    description: 'Prove everything. Reveal nothing.',
    url:         'https://okkult.io',
    siteName:    'Okkult',
    images: [{
      url:    '/og.png',
      width:  1200,
      height: 630,
      alt:    'Okkult Protocol',
    }],
    type: 'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Okkult Protocol',
    description: 'Prove everything. Reveal nothing.',
    creator:     '@Okkult_',
    images:      ['/og.png'],
  },
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-white antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
