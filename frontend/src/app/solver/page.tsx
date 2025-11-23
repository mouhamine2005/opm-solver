'use client';

import { useState, useEffect } from 'react';
import MatrixInput from '@/components/MatrixInput';
import VectorInput from '@/components/VectorInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import { solverApi } from '@/services/api';
import type { SolveResponse } from '@/types';
import { extractErrorMessage } from '@/utils/errorHandler';

export default function SolverPage() {
  const [matrixA, setMatrixA] = useState<number[][]>([[3, 2], [2, 4]]);
  const [vectorB, setVectorB] = useState<number[]>([5, 8]);
  const [method, setMethod] = useState<'gauss' | 'lu'>('gauss');
  const [result, setResult] = useState<SolveResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adapter automatiquement vectorB à la taille de matrixA
  useEffect(() => {
    const requiredSize = matrixA.length;
    if (vectorB.length !== requiredSize) {
      const newVectorB = Array(requiredSize).fill(null).map((_, i) => vectorB[i] || 0);
      setVectorB(newVectorB);
    }
  }, [matrixA.length]);

  const handleSolve = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await solverApi.solve({
        matrix_a: { data: matrixA },
        vector_b: { data: vectorB },
        method,
      });
      
      setResult(response);
    } catch (err: any) {
      setError(extractErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-600 mb-2">
          Solveur de Systèmes Linéaires
        </h1>
        <p className="text-gray-600">
          Résolvez des systèmes de la forme Ax = b avec différentes méthodes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Matrice A */}
        <MatrixInput
          rows={matrixA.length}
          cols={matrixA[0]?.length || 2}
          onChange={setMatrixA}
          label="Matrice A (coefficients)"
        />

        {/* Vecteur b */}
        <VectorInput
          size={matrixA.length}
          onChange={setVectorB}
          label="Vecteur b (résultats)"
        />
      </div>

      {/* Méthode et bouton de résolution */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Méthode de résolution</h3>
        
        <div className="space-y-3 mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="method"
              value="gauss"
              checked={method === 'gauss'}
              onChange={(e) => setMethod(e.target.value as 'gauss')}
              className="w-4 h-4"
            />
            <div>
              <div className="font-semibold">Élimination Gaussienne</div>
              <div className="text-sm text-gray-600">
                Méthode classique avec pivotage partiel
              </div>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="method"
              value="lu"
              checked={method === 'lu'}
              onChange={(e) => setMethod(e.target.value as 'lu')}
              className="w-4 h-4"
            />
            <div>
              <div className="font-semibold">Décomposition LU</div>
              <div className="text-sm text-gray-600">
                Factorisation A = LU puis résolution
              </div>
            </div>
          </label>
        </div>

        <button
          onClick={handleSolve}
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Résolution en cours...' : 'Résoudre le système'}
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <div className="font-semibold mb-1">Erreur</div>
          <div>{error}</div>
        </div>
      )}

      {/* Résultats */}
      {result && <ResultsDisplay result={result} vectorB={vectorB} />}

      {/* Exemples prédéfinis */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Exemples prédéfinis</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setMatrixA([[3, 2], [2, 4]]);
              setVectorB([5, 8]);
            }}
            className="p-4 bg-white rounded border hover:border-primary-500 text-left"
          >
            <div className="font-semibold mb-1">Système 2×2 simple</div>
            <div className="text-sm text-gray-600">Système bien conditionné</div>
          </button>

          <button
            onClick={() => {
              setMatrixA([[10, -1, 2], [-1, 11, -1], [2, -1, 10]]);
              setVectorB([6, 25, -11]);
            }}
            className="p-4 bg-white rounded border hover:border-primary-500 text-left"
          >
            <div className="font-semibold mb-1">Système 3×3</div>
            <div className="text-sm text-gray-600">Matrice diagonale dominante</div>
          </button>

          <button
            onClick={() => {
              setMatrixA([[2, -1, 0], [-1, 2, -1], [0, -1, 2]]);
              setVectorB([1, 0, 1]);
            }}
            className="p-4 bg-white rounded border hover:border-primary-500 text-left"
          >
            <div className="font-semibold mb-1">Matrice tridiagonale</div>
            <div className="text-sm text-gray-600">Symétrique et définie positive</div>
          </button>
        </div>
      </div>
    </div>
  );
}
