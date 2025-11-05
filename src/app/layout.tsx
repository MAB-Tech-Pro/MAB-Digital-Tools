import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Metadata object
export const metadata = {
  title: 'MAB Digital Tools',
  description: 'A MAB Digital Tools – clean, responsive, and SEO-friendly digital tools platform.',
  metadataBase: new URL('https://yourdomain.com'), // <-- live site URL
  keywords: ['digital tools', 'file converter', 'SEO tools', 'video downloader'],
  openGraph: {
    title: 'MAB Digital Tools',
    description: 'Clean and responsive digital tools platform',
    url: 'https://yourdomain.com',
    siteName: 'MAB Digital Tools',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MAB Digital Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAB Digital Tools – Lite Version',
    description: 'Clean and responsive digital tools platform',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

// New viewport export
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 mt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
