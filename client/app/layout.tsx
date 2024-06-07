import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { cn } from '@/lib/utils'
import { Provider } from 'jotai'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Exchangelicious',
  description: 'Savor the Flavor of Global Exchange!',
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
          <main className="min-h-[82vh] flex-1">{children}</main>
          <SiteFooter />
          <Toaster position="bottom-right" richColors />
        </Provider>
      </body>
    </html>
  )
}
