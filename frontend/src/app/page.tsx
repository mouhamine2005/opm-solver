export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary-600 mb-4">
          OPM Solver Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plateforme Interactive de Résolution de Systèmes Linéaires
        </p>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
          Résolvez des systèmes linéaires Ax = b avec des algorithmes avancés, 
          visualisez les résultats et analysez vos matrices en temps réel.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/solver"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Commencer
          </a>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Documentation API
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-3xl mb-4">🔢</div>
          <h3 className="text-xl font-semibold mb-2">Algorithmes OPM</h3>
          <p className="text-gray-600">
            Élimination Gaussienne, Décomposition LU, calcul de déterminant et matrice inverse
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-3xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Visualisations</h3>
          <p className="text-gray-600">
            Graphiques interactifs, heatmaps de matrices et comparaisons de résultats
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-3xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Performance</h3>
          <p className="text-gray-600">
            API FastAPI optimisée avec temps d'exécution et métriques en temps réel
          </p>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Démarrage Rapide</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">1. Entrer votre système</h3>
            <p className="text-gray-600 mb-4">
              Saisissez votre matrice A et votre vecteur b directement dans l'interface
            </p>
            <div className="bg-white p-4 rounded border">
              <code className="text-sm">
                A = [[3, 2], [2, 4]]<br />
                b = [5, 8]
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">2. Résoudre et Analyser</h3>
            <p className="text-gray-600 mb-4">
              Choisissez votre méthode (Gauss, LU) et obtenez la solution instantanément
            </p>
            <div className="bg-white p-4 rounded border">
              <code className="text-sm">
                x = [0.286, 1.786]<br />
                Erreur: 1.5e-15
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Technologies</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full">Next.js 14</span>
          <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full">React 18</span>
          <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full">TypeScript</span>
          <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full">FastAPI</span>
          <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full">Python</span>
          <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full">NumPy</span>
          <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full">TailwindCSS</span>
        </div>
      </div>
    </div>
  )
}
