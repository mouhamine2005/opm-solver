import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OPM Solver Pro - Résolution de Systèmes Linéaires',
  description: 'Plateforme Interactive de Résolution de Systèmes Linéaires et Simulation de Machines de Turing avec Next.js et FastAPI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <nav className="bg-primary-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">OPM Solver Pro</h1>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Accueil
                </a>
                <a href="/solver" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Solveur
                </a>
                <a href="/analysis" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Analyse
                </a>
                <a href="/turing" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 bg-primary-700">
                  🤖 Turing
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2024 OPM Solver Pro - Mohamed Amine Meddour - USTHB</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
