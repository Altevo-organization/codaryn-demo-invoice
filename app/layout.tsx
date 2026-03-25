import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agence Pixel — Facturation',
  description: 'Démo SaaS de facturation — Codaryn Software Studio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-[#0B0B0C] text-[#F0F2F5] antialiased">
        {children}
      </body>
    </html>
  )
}
