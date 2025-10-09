import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'

// Load Inter as the default font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Web Builder Sandbox',
  description: 'A visual one-page website builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className}`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
