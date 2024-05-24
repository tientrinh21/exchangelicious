import { SiteHeader } from '@/components/site-header'
import { cn } from '@/lib/utils'
import { Provider } from 'jotai'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ExchanGe',
  description: 'Make it EG for ExchanGe students',
  icons: {
    icon: '/logo.png',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          inter.className,
        )}
      >
        <Provider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          {/* TODO: Implement site footer */}
          {/* <SiteFooter /> */}
          <Toaster position="bottom-right" richColors />
        </Provider>
      </body>
    </html>
  )
}
