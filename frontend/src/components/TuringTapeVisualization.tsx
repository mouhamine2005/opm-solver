'use client';

/**
 * Composant de visualisation animée du ruban de Turing
 * Avec contrôles play/pause/vitesse et animation frame-by-frame
 * @author OPM Solver Pro
 * @year 2024
 */

import { useState, useEffect, useRef } from 'react';
import type { TuringMachineResponse, TuringAnimationFrame } from '@/types/turing';

interface TuringTapeVisualizationProps {
  result: TuringMachineResponse;
}

export default function TuringTapeVisualization({ result }: TuringTapeVisualizationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // ms par frame
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const frames = result.animation_frames || [];
  const totalFrames = frames.length;
  
  // Animation automatique
  useEffect(() => {
    if (isPlaying && currentFrame < totalFrames - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentFrame(prev => prev + 1);
      }, speed);
    } else if (currentFrame >= totalFrames - 1) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentFrame, speed, totalFrames]);
  
  const handlePlay = () => {
    if (currentFrame >= totalFrames - 1) {
      setCurrentFrame(0);
    }
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };
  
  const handleNext = () => {
    if (currentFrame < totalFrames - 1) {
      setCurrentFrame(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentFrame > 0) {
      setCurrentFrame(prev => prev - 1);
    }
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFrame(parseInt(e.target.value));
    setIsPlaying(false);
  };
  
  if (totalFrames === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        Aucune donnée d'animation disponible
      </div>
    );
  }
  
  const currentFrameData = frames[currentFrame];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* En-tête avec résultat */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          🎬 Visualisation Animée
        </h2>
        <div className={`px-4 py-2 rounded-lg font-bold ${
          result.accepted 
            ? 'bg-green-100 text-green-800' 
            : result.loop_detected 
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {result.accepted ? '✓ ACCEPTÉ' : result.loop_detected ? '⚠ BOUCLE INFINIE' : '✗ REJETÉ'}
        </div>
      </div>
      
      {/* Informations de l'étape actuelle */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Étape</div>
            <div className="text-2xl font-bold text-indigo-600">
              {currentFrameData.step} / {totalFrames - 1}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">État actuel</div>
            <div className="text-2xl font-bold text-purple-600">
              {currentFrameData.state}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-600">Action</div>
            <div className="text-sm font-semibold text-gray-700 mt-1">
              {currentFrameData.action || 'Initialisation'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Visualisation des rubans */}
      <div className="space-y-6">
        {currentFrameData.tapes.map((tape, tapeIndex) => (
          <div key={tapeIndex}>
            <div className="text-sm font-semibold text-gray-600 mb-2">
              {result.num_tapes > 1 ? `Ruban ${tapeIndex + 1}` : 'Ruban'}
            </div>
            
            <div className="relative overflow-x-auto">
              <div className="flex items-center justify-center space-x-1 min-w-max py-4">
                {/* Cellules du ruban */}
                {tape.split('').map((symbol, cellIndex) => {
                  const headPosition = currentFrameData.heads[tapeIndex];
                  const isHead = cellIndex === headPosition;
                  
                  return (
                    <div
                      key={cellIndex}
                      className={`
                        relative w-16 h-16 border-2 flex items-center justify-center
                        text-2xl font-mono font-bold transition-all duration-300
                        ${isHead 
                          ? 'border-red-500 bg-red-50 scale-110 shadow-lg' 
                          : 'border-gray-300 bg-white'
                        }
                      `}
                    >
                      {symbol === '_' ? (
                        <span className="text-gray-300">⊔</span>
                      ) : (
                        <span className={isHead ? 'text-red-600' : 'text-gray-800'}>
                          {symbol}
                        </span>
                      )}
                      
                      {/* Indicateur de tête */}
                      {isHead && (
                        <div className="absolute -top-8">
                          <div className="text-red-500 text-3xl animate-bounce">
                            ▼
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Cellule blanc suivante */}
                <div className="w-16 h-16 border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-gray-200 text-2xl">⊔</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Contrôles de lecture */}
      <div className="space-y-4">
        {/* Timeline */}
        <div className="w-full">
          <input
            type="range"
            min="0"
            max={totalFrames - 1}
            value={currentFrame}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Début</span>
            <span>Étape {currentFrame}</span>
            <span>Fin</span>
          </div>
        </div>
        
        {/* Boutons de contrôle */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            title="Recommencer"
          >
            ⏮ Début
          </button>
          
          <button
            onClick={handlePrevious}
            disabled={currentFrame === 0}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Étape précédente"
          >
            ◀ Précédent
          </button>
          
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              disabled={currentFrame >= totalFrames - 1}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              ▶ Lire
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              ⏸ Pause
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={currentFrame >= totalFrames - 1}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Étape suivante"
          >
            Suivant ▶
          </button>
        </div>
        
        {/* Contrôle de vitesse */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-600">Vitesse:</span>
          <div className="flex space-x-2">
            {[
              { label: '0.25x', value: 2000 },
              { label: '0.5x', value: 1000 },
              { label: '1x', value: 500 },
              { label: '2x', value: 250 },
              { label: '4x', value: 125 },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSpeed(value)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  speed === value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Étapes totales</div>
            <div className="font-bold text-gray-800">{result.total_steps}</div>
          </div>
          <div>
            <div className="text-gray-500">Temps d'exécution</div>
            <div className="font-bold text-gray-800">{(result.execution_time * 1000).toFixed(2)} ms</div>
          </div>
          <div>
            <div className="text-gray-500">État final</div>
            <div className="font-bold text-gray-800">{result.final_state}</div>
          </div>
          <div>
            <div className="text-gray-500">Rubans</div>
            <div className="font-bold text-gray-800">{result.num_tapes}</div>
          </div>
        </div>
      </div>
      
      {/* Message final */}
      {result.message && (
        <div className={`p-4 rounded-lg ${
          result.accepted 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : result.loop_detected
            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="font-semibold mb-1">Message:</div>
          <div>{result.message}</div>
        </div>
      )}
    </div>
  );
}
