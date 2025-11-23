'use client';

/**
 * Page principale du simulateur de Machine de Turing
 * Avec sélection d'exemples, configuration, et visualisation complète
 * @author OPM Solver Pro
 * @year 2024
 */

import { useState } from 'react';
import { solverApi } from '@/services/api';
import type { TuringMachineRequest, TuringMachineResponse, TuringTransition } from '@/types/turing';
import { extractErrorMessage } from '@/utils/errorHandler';
import { TURING_EXAMPLES, getExampleById } from '@/components/TuringExamples';
import TuringTapeVisualization from '@/components/TuringTapeVisualization';
import TuringExecutionLog from '@/components/TuringExecutionLog';
import TuringTransitionTable from '@/components/TuringTransitionTable';

export default function TuringPage() {
  // État de configuration
  const [selectedExample, setSelectedExample] = useState('binary_increment');
  const [tape, setTape] = useState('1011');
  const [tapes, setTapes] = useState<string[]>(['']);
  const [numTapes, setNumTapes] = useState(1);
  const [initialState, setInitialState] = useState('q0');
  const [finalStates, setFinalStates] = useState('q_halt');
  const [transitions, setTransitions] = useState<TuringTransition[]>([]);
  const [maxSteps, setMaxSteps] = useState(1000);
  const [detectLoops, setDetectLoops] = useState(true);
  
  // État de l'exécution
  const [result, setResult] = useState<TuringMachineResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Charger un exemple
  const loadExample = (exampleId: string) => {
    const example = getExampleById(exampleId);
    if (!example) return;
    
    setSelectedExample(exampleId);
    setNumTapes(example.num_tapes);
    
    if (example.num_tapes === 1) {
      setTape(example.initial_tape || '');
    } else {
      setTapes(example.initial_tapes || ['']);
    }
    
    setInitialState(example.initial_state);
    setFinalStates(example.final_states.join(', '));
    setTransitions(example.transitions);
    setResult(null);
    setError(null);
  };
  
  // Simuler la machine
  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const request: TuringMachineRequest = {
        initial_state: initialState,
        final_states: finalStates.split(',').map(s => s.trim()).filter(s => s),
        transitions: transitions,
        max_steps: maxSteps,
        detect_loops: detectLoops,
      };
      
      if (numTapes === 1) {
        request.initial_tape = tape;
      } else {
        request.initial_tapes = tapes;
      }
      
      const response = await solverApi.turingSimulate(request);
      setResult(response);
    } catch (err: any) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-600 mb-2 flex items-center">
          🤖 Machine de Turing
        </h1>
        <p className="text-gray-600">
          Simulez l'exécution d'une machine de Turing avec visualisation animée et analyse détaillée
        </p>
      </div>
      
      {/* Sélection d'exemples */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-4">📚 Exemples Classiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TURING_EXAMPLES.map(example => (
            <button
              key={example.id}
              onClick={() => loadExample(example.id)}
              className={`p-3 rounded-lg text-left transition ${
                selectedExample === example.id
                  ? 'bg-white text-indigo-700 font-bold shadow-lg'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <div className="font-semibold text-sm mb-1">{example.name}</div>
              <div className="text-xs opacity-80">{example.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Configuration */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Configuration de base */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Configuration</h3>
          
          <div className="space-y-4">
            {/* Nombre de rubans */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de rubans
              </label>
              <select
                value={numTapes}
                onChange={(e) => {
                  const n = parseInt(e.target.value);
                  setNumTapes(n);
                  if (n > 1) setTapes(Array(n).fill(''));
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(n => (
                  <option key={n} value={n}>{n} ruban{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            {/* Contenu des rubans */}
            {numTapes === 1 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ruban initial
                </label>
                <input
                  type="text"
                  value={tape}
                  onChange={(e) => setTape(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                  placeholder="Ex: 1011"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rubans initiaux
                </label>
                {tapes.map((t, i) => (
                  <input
                    key={i}
                    type="text"
                    value={t}
                    onChange={(e) => {
                      const newTapes = [...tapes];
                      newTapes[i] = e.target.value;
                      setTapes(newTapes);
                    }}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                    placeholder={`Ruban ${i + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* États */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                État initial
              </label>
              <input
                type="text"
                value={initialState}
                onChange={(e) => setInitialState(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="q0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                États finaux (séparés par virgule)
              </label>
              <input
                type="text"
                value={finalStates}
                onChange={(e) => setFinalStates(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="q_accept, q_halt"
              />
            </div>
          </div>
        </div>
        
        {/* Paramètres avancés */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔧 Paramètres Avancés</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre maximum d'étapes
              </label>
              <input
                type="number"
                min="1"
                max="1000000"
                value={maxSteps}
                onChange={(e) => setMaxSteps(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Limite: 1,000,000 étapes
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="detect-loops"
                checked={detectLoops}
                onChange={(e) => setDetectLoops(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="detect-loops" className="text-sm text-gray-700">
                Détecter les boucles infinies
              </label>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-800">
                <strong>💡 Astuce:</strong> Activez la détection de boucles pour éviter 
                les calculs sans fin. La machine s'arrêtera si une configuration se répète.
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-700">
                <strong>Statistiques:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>{transitions.length} transition{transitions.length > 1 ? 's' : ''} définie{transitions.length > 1 ? 's' : ''}</li>
                  <li>{numTapes} ruban{numTapes > 1 ? 's' : ''}</li>
                  <li>Limite: {maxSteps.toLocaleString()} étapes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table de transitions */}
      <div className="mb-6">
        <TuringTransitionTable
          transitions={transitions}
          onChange={setTransitions}
          numTapes={numTapes}
        />
      </div>
      
      {/* Bouton de simulation */}
      <div className="mb-8">
        <button
          onClick={handleSimulate}
          disabled={loading || transitions.length === 0}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? (
            <>⏳ Simulation en cours...</>
          ) : (
            <>▶️ Lancer la Simulation</>
          )}
        </button>
        {transitions.length === 0 && (
          <p className="text-center text-red-600 text-sm mt-2">
            Ajoutez au moins une transition pour lancer la simulation
          </p>
        )}
      </div>
      
      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">❌</span>
            <div>
              <div className="font-bold text-red-800 mb-1">Erreur de simulation</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Résultats */}
      {result && (
        <div className="space-y-6">
          <TuringTapeVisualization result={result} />
          <TuringExecutionLog steps={result.execution_steps} numTapes={result.num_tapes} />
        </div>
      )}
    </div>
  );
}
