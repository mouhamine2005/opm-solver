'use client';

import { useState, useEffect } from 'react';

interface VectorInputProps {
  size: number;
  onChange: (vector: number[]) => void;
  label: string;
}

export default function VectorInput({ size, onChange, label }: VectorInputProps) {
  const [vector, setVector] = useState<number[]>(Array(size).fill(0));

  // Synchroniser le vecteur avec les changements de taille
  useEffect(() => {
    const newVector = Array(size).fill(null).map((_, i) => vector[i] || 0);
    setVector(newVector);
    onChange(newVector);
  }, [size]);

  const handleChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newVector = vector.map((v, i) => (i === index ? numValue : v));
    setVector(newVector);
    onChange(newVector);
  };

  const fillRandom = () => {
    const newVector = vector.map(() => Math.round((Math.random() * 20 - 10) * 10) / 10);
    setVector(newVector);
    onChange(newVector);
  };

  const fillZeros = () => {
    const newVector = Array(size).fill(0);
    setVector(newVector);
    onChange(newVector);
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
            onClick={fillZeros}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Zéros
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {vector.map((value, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="w-8 text-gray-600">b[{index}]:</span>
            <input
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
