import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-display'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body'
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'M. Abubakar — Full Stack Developer',
  description: 'Full Stack Developer specializing in MERN, AI integrations & React Native. Available for freelance, remote & full-time work.',
  openGraph: {
    title: 'M. Abubakar — Full Stack Developer',
    description: 'Full Stack Developer — MERN · AI · React Native. Open to all work.',
    images: ['/assets/images/abubakar.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M. Abubakar — Full Stack Developer',
    description: 'Full Stack Developer — MERN · AI · React Native. Open to all work.',
    images: ['/assets/images/abubakar.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#062f35" />
      </head>
      <body className={`${plusJakarta.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
