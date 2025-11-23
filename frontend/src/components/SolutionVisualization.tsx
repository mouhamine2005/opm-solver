'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface SolutionVisualizationProps {
  solution: number[];
  vectorB: number[];
  residualError: number;
  executionTime: number;
  method: string;
  determinant?: number;
}

export default function SolutionVisualization({
  solution,
  vectorB,
  residualError,
  executionTime,
  method,
  determinant
}: SolutionVisualizationProps) {
  
  // Préparer les données pour le graphique de la solution (limiter à 20 pour la lisibilité)
  const solutionData = solution.slice(0, 20).map((val, idx) => ({
    variable: `x${idx + 1}`,
    valeur: typeof val === 'number' ? parseFloat(val.toFixed(6)) : 0,
    attendu: vectorB[idx] || 0
  }));

  // Données de performance
  const performanceData = [
    { name: 'Erreur résiduelle', valeur: residualError, couleur: residualError < 1e-10 ? '#10b981' : residualError < 1e-6 ? '#f59e0b' : '#ef4444' },
    { name: 'Temps (ms)', valeur: executionTime * 1000, couleur: '#3b82f6' }
  ];

  return (
    <div className="space-y-6">
      {/* Graphique de la solution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Vecteur Solution (x)</h3>
        {solution.length > 20 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            ℹ️ Affichage limité aux 20 premières variables sur {solution.length} au total
          </div>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={solutionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="variable" />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => value.toFixed(6)}
              contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Bar dataKey="valeur" name="Solution" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm max-h-96 overflow-auto">
          {solution.slice(0, 12).map((val, idx) => (
            <div key={idx} className="p-3 bg-purple-50 rounded border border-purple-200">
              <div className="text-gray-600 font-medium">x<sub>{idx + 1}</sub></div>
              <div className="text-lg font-bold text-purple-700">{typeof val === 'number' ? val.toFixed(6) : String(val)}</div>
            </div>
          ))}
          {solution.length > 12 && (
            <div className="col-span-2 md:col-span-4 p-3 bg-gray-50 rounded border text-center text-gray-600">
              ... et {solution.length - 12} autres variables (total: {solution.length})
            </div>
          )}
        </div>
      </div>

      {/* Métriques de qualité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Erreur résiduelle */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">🎯 Précision</h3>
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-bold ${residualError < 1e-10 ? 'text-green-600' : residualError < 1e-6 ? 'text-yellow-600' : 'text-red-600'}`}>
              {residualError.toExponential(2)}
            </div>
            <div className="mt-2 text-sm text-gray-600">Erreur résiduelle</div>
            <div className="mt-2 text-xs">
              {residualError < 1e-10 && '✓ Excellente précision'}
              {residualError >= 1e-10 && residualError < 1e-6 && '⚠️ Bonne précision'}
              {residualError >= 1e-6 && '❌ Précision limitée'}
            </div>
          </div>
        </div>

        {/* Temps d'exécution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">⚡ Performance</h3>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-blue-600">
              {(executionTime * 1000).toFixed(2)}
            </div>
            <div className="mt-2 text-sm text-gray-600">millisecondes</div>
            <div className="mt-2 text-xs">
              {executionTime < 0.001 && '🚀 Ultra rapide'}
              {executionTime >= 0.001 && executionTime < 0.01 && '✓ Rapide'}
              {executionTime >= 0.01 && executionTime < 0.1 && '⚠️ Moyen'}
              {executionTime >= 0.1 && '⏱️ Lent'}
            </div>
          </div>
        </div>

        {/* Méthode utilisée */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">🔧 Méthode</h3>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-primary-600 capitalize">
              {method === 'gauss' ? 'Élimination\nGaussienne' : 'Décomposition\nLU'}
            </div>
            <div className="mt-4 text-xs text-center text-gray-600">
              {method === 'gauss' && 'Pivotage partiel'}
              {method === 'lu' && 'Factorisation A = LU'}
            </div>
          </div>
        </div>
      </div>

      {/* Vérification de la solution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">✓ Vérification</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">||Ax - b||</span>
            <span className={`font-mono ${residualError < 1e-10 ? 'text-green-600' : 'text-yellow-600'}`}>
              {residualError.toExponential(3)}
            </span>
          </div>
          {determinant !== undefined && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">det(A)</span>
              <span className="font-mono text-blue-600">
                {determinant.toExponential(3)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Dimension</span>
            <span className="font-mono text-purple-600">
              {solution.length}×1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
