import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ContextWrapper from '../components/ContextWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TeamProVision',
  description: 'Make Projects Simpler!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextWrapper>
        {children}
        </ContextWrapper>
      </body>
    </html>
  )
}
