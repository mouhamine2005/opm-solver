"use client";
import React, { useState } from 'react';
import { solverApi } from '@/services/api';
import MatrixInput from '@/components/MatrixInput';
import MatrixVisualization from '@/components/MatrixVisualization';
import type { AnalysisResponse } from '@/types';
import { extractErrorMessage } from '@/utils/errorHandler';

export default function AnalysisPage() {
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  const [matrixA, setMatrixA] = useState<number[][]>(Array.from({ length: 3 }, () => Array(3).fill(0)));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleMatrixChange = (newMatrix: number[][]) => {
    setMatrixA(newMatrix);
  };

  const updateSize = (r: number, c: number) => {
    setRows(r);
    setCols(c);
    setMatrixA(Array.from({ length: r }, () => Array(c).fill(0)));
    setResult(null);
  };

  const loadExample = (type: string) => {
    if (type === 'sym') {
      const ex = [
        [4, 1, 2],
        [1, 3, 0],
        [2, 0, 5],
      ];
      setRows(3); setCols(3); setMatrixA(ex);
    } else if (type === 'spd') {
      const ex = [
        [6, 2, 1],
        [2, 5, 2],
        [1, 2, 4],
      ];
      setRows(3); setCols(3); setMatrixA(ex);
    } else if (type === 'rect') {
      const ex = [
        [1, 2, 3, 4],
        [2, 4, 6, 8],
        [3, 6, 9, 12],
      ];
      setRows(3); setCols(4); setMatrixA(ex);
    }
    setResult(null);
  };

  const analyzeMatrix = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = { matrix_a: { data: matrixA } };
      const res = await solverApi.analyze(payload);
      setResult(res);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Analyse de Matrice</h1>
      <p className="text-gray-600 mb-6">Envoyez une matrice au backend pour obtenir ses propriétés (déterminant, conditionnement, symétrie, rang, valeurs propres).</p>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Lignes</label>
            <input type="number" min={1} max={100} value={rows} onChange={e => updateSize(parseInt(e.target.value||'1'), cols)} className="mt-1 w-24 px-2 py-1 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Colonnes</label>
            <input type="number" min={1} max={100} value={cols} onChange={e => updateSize(rows, parseInt(e.target.value||'1'))} className="mt-1 w-24 px-2 py-1 border rounded" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadExample('sym')} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">Exemple Symétrique</button>
            <button onClick={() => loadExample('spd')} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Exemple SPD</button>
            <button onClick={() => loadExample('rect')} className="px-3 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm">Exemple Rectangulaire</button>
          </div>
          <div className="ml-auto">
            <button disabled={loading} onClick={analyzeMatrix} className="px-5 py-2 bg-primary-600 text-white rounded shadow hover:bg-primary-700 disabled:opacity-50">
              {loading ? 'Analyse...' : 'Analyser la Matrice'}
            </button>
          </div>
        </div>
      </div>

      {/* Matrix Input */}
      <MatrixInput rows={rows} cols={cols} label="Matrice A" onChange={handleMatrixChange} />

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Visualisations graphiques */}
          <MatrixVisualization
            matrix={matrixA}
            eigenvalues={result.eigenvalues}
            determinant={result.determinant}
            conditionNumber={result.condition_number}
          />
          
          {/* Résultats numériques */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-2">Résultats de l'analyse</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded bg-blue-50 border">
              <p className="text-sm text-gray-500">Déterminant</p>
              <p className="text-xl font-bold">{result.determinant?.toExponential?.() || result.determinant}</p>
            </div>
            <div className="p-4 rounded bg-purple-50 border">
              <p className="text-sm text-gray-500">Conditionnement</p>
              <p className="text-xl font-bold">{result.condition_number?.toFixed?.(3)}</p>
            </div>
            <div className="p-4 rounded bg-green-50 border">
              <p className="text-sm text-gray-500">Rang</p>
              <p className="text-xl font-bold">{result.rank}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-yellow-50 border">
              <p className="text-sm text-gray-500 mb-1">Symétrie</p>
              <p className="font-medium">{result.is_symmetric ? '✓ Symétrique' : '✗ Non symétrique'}</p>
              <p className="font-medium mt-2">{result.is_singular ? '✗ Singulière' : '✓ Non singulière'}</p>
              {typeof result.is_positive_definite === 'boolean' && (
                <p className="font-medium mt-2">{result.is_positive_definite ? '✓ Définie positive' : '✗ Non définie positive'}</p>
              )}
            </div>
            <div className="p-4 rounded bg-gray-50 border">
              <p className="text-sm text-gray-500 mb-1">Valeurs propres</p>
              <div className="text-sm space-y-1 max-h-40 overflow-auto">
                {result.eigenvalues?.map((ev, i) => (
                  <div key={i}>{i+1}. {ev.toFixed(6)}</div>
                )) || <div className="italic text-gray-500">Non disponibles</div>}
              </div>
            </div>
          </div>
          <div className="p-4 rounded bg-white border">
            <p className="text-sm text-gray-500 mb-2">Recommandations</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {result.recommendations?.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
          <p className="text-xs text-gray-400">Temps d'exécution: {(result.execution_time*1000).toFixed(2)} ms</p>
          </div>
        </div>
      )}
    </div>
  );
}
