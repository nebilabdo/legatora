import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'LEGATORA - Legal Management Portal',
  description: 'Power of Attorney and Legal Document Management System',
  generator: 'vercel.app',
  icons: {
    icon: [
      {
        url: '/legatora-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/legatora-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/legatora-logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
