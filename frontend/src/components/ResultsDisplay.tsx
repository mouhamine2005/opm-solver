'use client';

import type { SolveResponse } from '@/types';
import SolutionVisualization from './SolutionVisualization';

interface ResultsDisplayProps {
  result: SolveResponse;
  vectorB?: number[];
}

export default function ResultsDisplay({ result, vectorB = [] }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Visualisations graphiques */}
      <SolutionVisualization
        solution={result.solution}
        vectorB={vectorB}
        residualError={result.residual_error}
        executionTime={result.execution_time}
        method={result.method}
        determinant={result.determinant}
      />
      
      {/* Résultats numériques détaillés */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-2xl font-bold text-green-600 mb-2">✓ Système résolu avec succès</h3>
        <p className="text-gray-600">{result.message}</p>
      </div>

      {/* Solution */}
      <div>
        <h4 className="font-semibold text-lg mb-2">Solution x:</h4>
        <div className="bg-gray-50 p-4 rounded">
          <div className="font-mono text-sm space-y-1 max-h-60 overflow-auto">
            {result.solution.slice(0, 20).map((value, index) => (
              <div key={index}>
                x[{index}] = <span className="font-bold">{typeof value === 'number' ? value.toFixed(6) : String(value)}</span>
              </div>
            ))}
            {result.solution.length > 20 && (
              <div className="text-gray-500 italic mt-2">
                ... et {result.solution.length - 20} autres valeurs
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métriques */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-sm text-gray-600 mb-1">Erreur résiduelle</div>
          <div className="text-2xl font-bold text-blue-600">
            {result.residual_error.toExponential(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">||Ax - b||</div>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <div className="text-sm text-gray-600 mb-1">Temps d'exécution</div>
          <div className="text-2xl font-bold text-purple-600">
            {(result.execution_time * 1000).toFixed(2)} ms
          </div>
          <div className="text-xs text-gray-500 mt-1">Méthode: {result.method}</div>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <div className="text-sm text-gray-600 mb-1">Déterminant</div>
          <div className="text-2xl font-bold text-green-600">
            {typeof result.determinant === 'number' ? result.determinant.toFixed(4) : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">det(A)</div>
        </div>

        <div className="bg-orange-50 p-4 rounded">
          <div className="text-sm text-gray-600 mb-1">Conditionnement</div>
          <div className="text-2xl font-bold text-orange-600">
            {typeof result.matrix_condition === 'number' ? result.matrix_condition.toFixed(2) : 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {typeof result.matrix_condition === 'number' && result.matrix_condition < 100 ? '✓ Bien conditionnée' : '⚠️ Mal conditionnée'}
          </div>
        </div>
      </div>

      {/* Interprétation */}
      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">Interprétation:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          {result.residual_error < 1e-10 && (
            <li>✓ Solution très précise (erreur {'<'} 10⁻¹⁰)</li>
          )}
          {Math.abs(result.determinant) > 1e-6 && (
            <li>✓ Matrice non-singulière (det ≠ 0)</li>
          )}
          {result.matrix_condition < 100 && (
            <li>✓ Matrice bien conditionnée (stabilité numérique assurée)</li>
          )}
          {result.matrix_condition > 100 && result.matrix_condition < 1e6 && (
            <li>⚠️ Matrice moyennement conditionnée</li>
          )}
          {result.matrix_condition > 1e6 && (
            <li>❌ Matrice mal conditionnée (risque d'instabilité numérique)</li>
          )}
        </ul>
      </div>
      </div>
    </div>
  );
}
