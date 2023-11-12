import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import config from '@/config/config';

import Navbar from '@/components/Navbar';

import { UserContextProvider } from './context/store';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContextProvider>
          <Navbar />
        {children}
        </UserContextProvider>
      </body>
    </html>
  )
}
