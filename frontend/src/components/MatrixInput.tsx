'use client';

import { useState, useEffect } from 'react';

interface MatrixInputProps {
  rows: number;
  cols: number;
  onChange: (matrix: number[][]) => void;
  label: string;
}

export default function MatrixInput({ rows, cols, onChange, label }: MatrixInputProps) {
  const [matrix, setMatrix] = useState<number[][]>(
    Array(rows).fill(null).map(() => Array(cols).fill(0))
  );

  // Synchroniser la matrice avec les changements de rows/cols du parent
  useEffect(() => {
    const currentRows = matrix.length;
    const currentCols = matrix[0]?.length || 0;
    
    // Ne mettre à jour que si les dimensions ont changé
    if (currentRows !== rows || currentCols !== cols) {
      const newMatrix = Array(rows).fill(null).map((_, i) =>
        Array(cols).fill(null).map((_, j) => matrix[i]?.[j] || 0)
      );
      setMatrix(newMatrix);
      onChange(newMatrix);
    }
  }, [rows, cols]);

  const handleCellChange = (i: number, j: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = matrix.map((row, rowIdx) =>
      row.map((cell, colIdx) => (rowIdx === i && colIdx === j ? numValue : cell))
    );
    setMatrix(newMatrix);
    onChange(newMatrix);
  };

  const handleRowsChange = (newRows: number) => {
    if (newRows < 1 || newRows > 100) return;
    const newMatrix = Array(newRows).fill(null).map((_, i) =>
      Array(cols).fill(null).map((_, j) => matrix[i]?.[j] || 0)
    );
    setMatrix(newMatrix);
    onChange(newMatrix);
  };

  const handleColsChange = (newCols: number) => {
    if (newCols < 1 || newCols > 100) return;
    const newMatrix = matrix.map(row =>
      Array(newCols).fill(null).map((_, j) => row[j] || 0)
    );
    setMatrix(newMatrix);
    onChange(newMatrix);
  };

  const fillRandom = () => {
    const newMatrix = matrix.map(row =>
      row.map(() => Math.round((Math.random() * 20 - 10) * 10) / 10)
    );
    setMatrix(newMatrix);
    onChange(newMatrix);
  };

  const fillIdentity = () => {
    const newMatrix = matrix.map((row, i) =>
      row.map((_, j) => (i === j ? 1 : 0))
    );
    setMatrix(newMatrix);
    onChange(newMatrix);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{label}</h3>
        <div className="flex space-x-2">
          <button
            onClick={fillRandom}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Aléatoire
          </button>
          <button
            onClick={fillIdentity}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Identité
          </button>
        </div>
      </div>

      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Lignes:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={matrix.length}
            onChange={(e) => handleRowsChange(parseInt(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Colonnes:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={matrix[0]?.length || 0}
            onChange={(e) => handleColsChange(parseInt(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="p-1">
                    <input
                      type="number"
                      step="0.1"
                      value={cell}
                      onChange={(e) => handleCellChange(i, j, e.target.value)}
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
