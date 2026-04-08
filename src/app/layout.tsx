import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Connect to Rent – Find Your Perfect Apartment',
    template: '%s | Connect to Rent',
  },
  description:
    'The premium platform connecting renters with landlords. Browse verified listings, contact landlords directly, and find your next home.',
  keywords: ['rent', 'apartment', 'listings', 'landlord', 'renter', 'housing'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
