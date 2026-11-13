import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { MouseCursor } from './components/MouseCursor'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahsan-portfolio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ahsan Aziz — DevOps Engineer',
  description: 'DevOps Engineer specializing in Docker, CI/CD pipelines, AWS, and cloud infrastructure. Available for freelance, remote & full-time work.',
  keywords: ['DevOps', 'Docker', 'CI/CD', 'AWS', 'Cloud Infrastructure', 'Engineer'],
  authors: [{ name: 'Ahsan Aziz', url: siteUrl }],
  creator: 'Ahsan Aziz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Ahsan Aziz — DevOps Engineer',
    description: 'DevOps Engineer — Docker · CI/CD · AWS · Cloud Infrastructure. Open to opportunities.',
    images: [
      {
        url: '/images/231317241.png',
        width: 1200,
        height: 630,
        alt: 'Ahsan Aziz - DevOps Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahsan Aziz — DevOps Engineer',
    description: 'DevOps Engineer — Docker · CI/CD · AWS · Cloud Infrastructure. Open to opportunities.',
    images: ['/images/231317241.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ahsan Aziz',
    url: siteUrl,
    jobTitle: 'DevOps Engineer',
    image: `${siteUrl}/images/231317241.png`,
    sameAs: [
      'https://github.com/YOUR_USERNAME',
      'https://linkedin.com/in/YOUR_USERNAME',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Self-Employed',
    },
    skills: [
      'Docker',
      'CI/CD Pipelines',
      'AWS',
      'Oracle Cloud',
      'Linux Administration',
      'GitHub Actions',
    ],
    knowsLanguage: ['en', 'ur'],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="theme-color" content="#062f35" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakarta.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
        <MouseCursor />
        {children}
      </body>
    </html>
  )
}
