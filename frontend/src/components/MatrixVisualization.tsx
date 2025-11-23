'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface MatrixVisualizationProps {
  matrix: number[][];
  eigenvalues?: number[];
  determinant?: number;
  conditionNumber?: number;
}

export default function MatrixVisualization({ 
  matrix, 
  eigenvalues, 
  determinant,
  conditionNumber 
}: MatrixVisualizationProps) {
  
  // Préparer les données pour le graphique des valeurs propres
  const eigenData = eigenvalues?.map((val, idx) => ({
    name: `λ${idx + 1}`,
    valeur: typeof val === 'number' ? parseFloat(val.toFixed(4)) : 0
  })) || [];

  // Calculer les statistiques de la matrice pour la heatmap
  const flatValues = matrix.flat();
  const minVal = Math.min(...flatValues);
  const maxVal = Math.max(...flatValues);
  
  // Fonction pour obtenir la couleur en fonction de la valeur
  const getColor = (value: number) => {
    const normalized = maxVal !== minVal ? (value - minVal) / (maxVal - minVal) : 0.5;
    const hue = (1 - normalized) * 240; // 240 = bleu, 0 = rouge
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="space-y-6">
      {/* Heatmap de la matrice */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Heatmap de la Matrice</h3>
        {matrix.length > 15 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
            ⚠️ Matrice trop grande ({matrix.length}×{matrix[0]?.length || 0}). Affichage des 15 premières lignes/colonnes seulement.
          </div>
        )}
        <div className="overflow-x-auto max-h-96">
          <div className="inline-block min-w-full">
            <table className="border-collapse">
              <tbody>
                {matrix.slice(0, 15).map((row, i) => (
                  <tr key={i}>
                    {row.slice(0, 15).map((val, j) => (
                      <td
                        key={j}
                        className="border border-gray-300 w-16 h-16 text-center text-sm font-medium relative"
                        style={{ backgroundColor: getColor(val) }}
                        title={`[${i},${j}] = ${typeof val === 'number' ? val : 'N/A'}`}
                      >
                        <span className="text-white drop-shadow-md">
                          {typeof val === 'number' ? val.toFixed(2) : 'N/A'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4" style={{ backgroundColor: getColor(minVal) }}></div>
              <span>Min: {minVal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4" style={{ backgroundColor: getColor((minVal + maxVal) / 2) }}></div>
              <span>Moy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4" style={{ backgroundColor: getColor(maxVal) }}></div>
              <span>Max: {maxVal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique des valeurs propres */}
      {eigenvalues && eigenvalues.length > 0 && eigenvalues.length <= 20 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Valeurs Propres</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eigenData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [value.toFixed(4), 'Valeur']}
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="valeur" name="Valeur propre" radius={[8, 8, 0, 0]}>
                {eigenData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.valeur >= 0 ? '#3b82f6' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Note:</strong> Les valeurs propres positives sont en bleu, les négatives en rouge.</p>
          </div>
        </div>
      )}
      
      {/* Message pour les grandes matrices sans valeurs propres */}
      {eigenvalues && eigenvalues.length > 20 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Valeurs Propres</h3>
          <div className="p-6 bg-blue-50 border border-blue-200 rounded text-center">
            <p className="text-blue-700 mb-2">
              ℹ️ Matrice de dimension {eigenvalues.length}×{eigenvalues.length}
            </p>
            <p className="text-sm text-blue-600">
              Trop de valeurs propres pour être affichées graphiquement. Consultez les résultats numériques ci-dessous.
            </p>
          </div>
        </div>
      )}

      {/* Statistiques visuelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conditionnement visuel */}
        {conditionNumber !== undefined && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🎯 Conditionnement</h3>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full flex items-center justify-center text-white text-sm font-bold transition-all"
                  style={{
                    width: `${Math.min((Math.log10(conditionNumber) / 10) * 100, 100)}%`,
                    backgroundColor: conditionNumber < 100 ? '#10b981' : conditionNumber < 1000 ? '#f59e0b' : '#ef4444'
                  }}
                >
                  {typeof conditionNumber === 'number' ? conditionNumber.toExponential(2) : conditionNumber}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {conditionNumber < 100 && '✓ Bien conditionnée'}
                {conditionNumber >= 100 && conditionNumber < 10000 && '⚠️ Moyennement conditionnée'}
                {conditionNumber >= 10000 && '❌ Mal conditionnée'}
              </div>
            </div>
          </div>
        )}

        {/* Déterminant visuel */}
        {determinant !== undefined && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🔢 Déterminant</h3>
            <div className="flex items-center justify-center">
              <div className={`text-4xl font-bold ${Math.abs(determinant) < 1e-10 ? 'text-red-600' : determinant > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                {typeof determinant === 'number' ? determinant.toExponential(3) : determinant}
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              {Math.abs(determinant) < 1e-10 && '⚠️ Matrice singulière (det ≈ 0)'}
              {Math.abs(determinant) >= 1e-10 && determinant > 0 && '✓ Déterminant positif'}
              {Math.abs(determinant) >= 1e-10 && determinant < 0 && '✓ Déterminant négatif'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
