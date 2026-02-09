import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Axon | The Operating System for Your Thoughts',
  description: 'Capture ideas, connect knowledge, and surface insights with AI. Your second brain that actually thinks.',
  keywords: ['knowledge management', 'AI', 'second brain', 'note taking', 'semantic search', 'RAG'],
  authors: [{ name: 'Axon' }],
  openGraph: {
    title: 'Axon | The Operating System for Your Thoughts',
    description: 'Capture ideas, connect knowledge, and surface insights with AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axon | The Operating System for Your Thoughts',
    description: 'Capture ideas, connect knowledge, and surface insights with AI.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased noise">{children}</body>
    </html>
  )
}
