'use client';

/**
 * Log d'exécution détaillé de la machine de Turing
 * Affiche toutes les étapes avec filtres et recherche
 * @author OPM Solver Pro
 * @year 2024
 */

import { useState } from 'react';
import type { TuringExecutionStep } from '@/types/turing';

interface TuringExecutionLogProps {
  steps: TuringExecutionStep[];
  numTapes?: number;
}

export default function TuringExecutionLog({ steps, numTapes = 1 }: TuringExecutionLogProps) {
  const [filterState, setFilterState] = useState<string>('');
  const [showOnlyTransitions, setShowOnlyTransitions] = useState(false);
  const [maxStepsToShow, setMaxStepsToShow] = useState(100);
  
  // Filtrer les étapes
  const filteredSteps = steps.filter(step => {
    if (filterState && !step.current_state.toLowerCase().includes(filterState.toLowerCase())) {
      return false;
    }
    if (showOnlyTransitions && !step.action_taken) {
      return false;
    }
    return true;
  }).slice(0, maxStepsToShow);
  
  // Extraire tous les états uniques
  const uniqueStates = Array.from(new Set(steps.map(s => s.current_state)));
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📜 Journal d'Exécution
        </h2>
        <div className="text-sm text-gray-600">
          {filteredSteps.length} / {steps.length} étapes affichées
        </div>
      </div>
      
      {/* Filtres et contrôles */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Filtre par état */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par état
            </label>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            >
              <option value="">Tous les états</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          
          {/* Limite d'affichage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre d'étapes à afficher
            </label>
            <select
              value={maxStepsToShow}
              onChange={(e) => setMaxStepsToShow(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            >
              <option value="50">50 étapes</option>
              <option value="100">100 étapes</option>
              <option value="500">500 étapes</option>
              <option value="1000">1000 étapes</option>
              <option value={steps.length}>Toutes ({steps.length})</option>
            </select>
          </div>
        </div>
        
        {/* Option affichage */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="transitions-only"
            checked={showOnlyTransitions}
            onChange={(e) => setShowOnlyTransitions(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="transitions-only" className="text-sm text-gray-700">
            Afficher uniquement les étapes avec transitions
          </label>
        </div>
      </div>
      
      {/* Table des étapes */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Étape</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">État</th>
              {numTapes > 1 ? (
                <>
                  {Array.from({ length: numTapes }).map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left font-semibold text-gray-700">
                      Ruban {i + 1}
                    </th>
                  ))}
                </>
              ) : (
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Ruban</th>
              )}
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Symbole lu</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSteps.map((step) => (
              <tr 
                key={step.step_number}
                className="hover:bg-blue-50 transition-colors"
              >
                {/* Numéro d'étape */}
                <td className="px-4 py-3 font-mono text-gray-600">
                  {step.step_number}
                </td>
                
                {/* État actuel */}
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-mono text-xs">
                    {step.current_state}
                  </span>
                </td>
                
                {/* Contenus des rubans */}
                {step.tape_contents.map((content, tapeIndex) => (
                  <td key={tapeIndex} className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[200px] overflow-x-auto block">
                        {content.substring(0, 20)}{content.length > 20 ? '...' : ''}
                      </code>
                      <span className="text-xs text-gray-500">
                        @{step.head_positions[tapeIndex]}
                      </span>
                    </div>
                  </td>
                ))}
                
                {/* Symboles lus */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {step.symbols_read.map((symbol, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs"
                      >
                        {symbol === '_' ? '⊔' : symbol}
                      </span>
                    ))}
                  </div>
                </td>
                
                {/* Action effectuée */}
                <td className="px-4 py-3 text-xs text-gray-700 max-w-xs">
                  {step.action_taken || <span className="text-gray-400 italic">Aucune action</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Message si tronqué */}
      {filteredSteps.length < steps.length && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Note:</strong> Seulement {filteredSteps.length} étapes sur {steps.length} sont affichées. 
          Ajustez les filtres pour voir plus d'étapes.
        </div>
      )}
      
      {/* Statistiques récapitulatives */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-sm text-indigo-600 font-medium">États visités</div>
          <div className="text-2xl font-bold text-indigo-800">{uniqueStates.length}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Transitions</div>
          <div className="text-2xl font-bold text-green-800">
            {steps.filter(s => s.action_taken).length}
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium">Étapes totales</div>
          <div className="text-2xl font-bold text-purple-800">{steps.length}</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-orange-600 font-medium">Rubans</div>
          <div className="text-2xl font-bold text-orange-800">{numTapes}</div>
        </div>
      </div>
    </div>
  );
}
