'use client';

/**
 * Éditeur de table de transitions avec opérations CRUD
 * Supporte mono-ruban et multi-rubans
 * @author OPM Solver Pro
 * @year 2024
 */

import { useState } from 'react';
import type { TuringTransition, MoveDirection } from '@/types/turing';

interface TuringTransitionTableProps {
  transitions: TuringTransition[];
  onChange: (transitions: TuringTransition[]) => void;
  numTapes?: number;
}

export default function TuringTransitionTable({ 
  transitions, 
  onChange, 
  numTapes = 1 
}: TuringTransitionTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTransition, setNewTransition] = useState<TuringTransition>(
    createEmptyTransition(numTapes)
  );
  
  function createEmptyTransition(tapes: number): TuringTransition {
    if (tapes === 1) {
      return {
        current_state: '',
        read_symbol: '',
        next_state: '',
        write_symbol: '',
        move_direction: 'N'
      };
    } else {
      return {
        current_state: '',
        read_symbols: Array(tapes).fill(''),
        next_state: '',
        write_symbols: Array(tapes).fill(''),
        move_directions: Array(tapes).fill('N' as MoveDirection)
      };
    }
  }
  
  const handleAdd = () => {
    if (validateTransition(newTransition)) {
      onChange([...transitions, newTransition]);
      setNewTransition(createEmptyTransition(numTapes));
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };
  
  const handleDelete = (index: number) => {
    if (confirm('Supprimer cette transition?')) {
      const newTransitions = transitions.filter((_, i) => i !== index);
      onChange(newTransitions);
    }
  };
  
  const handleUpdate = (index: number, updated: TuringTransition) => {
    const newTransitions = [...transitions];
    newTransitions[index] = updated;
    onChange(newTransitions);
    setEditingIndex(null);
  };
  
  const validateTransition = (trans: TuringTransition): boolean => {
    if (!trans.current_state || !trans.next_state) return false;
    
    if (numTapes === 1) {
      return !!(trans.read_symbol && trans.write_symbol && trans.move_direction);
    } else {
      return !!(
        trans.read_symbols?.length === numTapes &&
        trans.write_symbols?.length === numTapes &&
        trans.move_directions?.length === numTapes &&
        trans.read_symbols.every(s => s) &&
        trans.write_symbols.every(s => s)
      );
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          ⚙️ Table de Transitions
          {numTapes > 1 && <span className="text-sm text-gray-500 ml-2">({numTapes} rubans)</span>}
        </h3>
        <div className="text-sm text-gray-600">
          {transitions.length} transition{transitions.length > 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Table des transitions existantes */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 text-left border">État actuel</th>
              {numTapes === 1 ? (
                <>
                  <th className="px-3 py-2 text-left border">Lire</th>
                  <th className="px-3 py-2 text-left border">→ État</th>
                  <th className="px-3 py-2 text-left border">Écrire</th>
                  <th className="px-3 py-2 text-left border">Mouvement</th>
                </>
              ) : (
                <>
                  <th className="px-3 py-2 text-left border">Lire (Rubans)</th>
                  <th className="px-3 py-2 text-left border">→ État</th>
                  <th className="px-3 py-2 text-left border">Écrire (Rubans)</th>
                  <th className="px-3 py-2 text-left border">Mouvements</th>
                </>
              )}
              <th className="px-3 py-2 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transitions.map((trans, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {editingIndex === index ? (
                  <TransitionEditRow
                    transition={trans}
                    numTapes={numTapes}
                    onSave={(updated) => handleUpdate(index, updated)}
                    onCancel={() => setEditingIndex(null)}
                  />
                ) : (
                  <TransitionDisplayRow
                    transition={trans}
                    numTapes={numTapes}
                    onEdit={() => setEditingIndex(index)}
                    onDelete={() => handleDelete(index)}
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Formulaire d'ajout */}
      <div className="border-t-2 pt-6">
        <h4 className="font-semibold text-gray-700 mb-3">➕ Ajouter une nouvelle transition</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          {numTapes === 1 ? (
            <div className="grid grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="État actuel"
                value={newTransition.current_state}
                onChange={(e) => setNewTransition({ ...newTransition, current_state: e.target.value })}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Lire"
                maxLength={1}
                value={newTransition.read_symbol || ''}
                onChange={(e) => setNewTransition({ ...newTransition, read_symbol: e.target.value })}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="→ État"
                value={newTransition.next_state}
                onChange={(e) => setNewTransition({ ...newTransition, next_state: e.target.value })}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Écrire"
                maxLength={1}
                value={newTransition.write_symbol || ''}
                onChange={(e) => setNewTransition({ ...newTransition, write_symbol: e.target.value })}
                className="px-3 py-2 border rounded"
              />
              <select
                value={newTransition.move_direction || 'N'}
                onChange={(e) => setNewTransition({ ...newTransition, move_direction: e.target.value as MoveDirection })}
                className="px-3 py-2 border rounded"
              >
                <option value="L">← Gauche</option>
                <option value="R">→ Droite</option>
                <option value="N">⊙ Aucun</option>
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="État actuel"
                  value={newTransition.current_state}
                  onChange={(e) => setNewTransition({ ...newTransition, current_state: e.target.value })}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="→ État suivant"
                  value={newTransition.next_state}
                  onChange={(e) => setNewTransition({ ...newTransition, next_state: e.target.value })}
                  className="px-3 py-2 border rounded"
                />
              </div>
              
              {Array.from({ length: numTapes }).map((_, tapeIndex) => (
                <div key={tapeIndex} className="grid grid-cols-4 gap-3 items-center">
                  <div className="text-sm font-medium text-gray-600">Ruban {tapeIndex + 1}:</div>
                  <input
                    type="text"
                    placeholder="Lire"
                    maxLength={1}
                    value={newTransition.read_symbols?.[tapeIndex] || ''}
                    onChange={(e) => {
                      const symbols = [...(newTransition.read_symbols || [])];
                      symbols[tapeIndex] = e.target.value;
                      setNewTransition({ ...newTransition, read_symbols: symbols });
                    }}
                    className="px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Écrire"
                    maxLength={1}
                    value={newTransition.write_symbols?.[tapeIndex] || ''}
                    onChange={(e) => {
                      const symbols = [...(newTransition.write_symbols || [])];
                      symbols[tapeIndex] = e.target.value;
                      setNewTransition({ ...newTransition, write_symbols: symbols });
                    }}
                    className="px-3 py-2 border rounded"
                  />
                  <select
                    value={newTransition.move_directions?.[tapeIndex] || 'N'}
                    onChange={(e) => {
                      const dirs = [...(newTransition.move_directions || [])];
                      dirs[tapeIndex] = e.target.value as MoveDirection;
                      setNewTransition({ ...newTransition, move_directions: dirs });
                    }}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="L">← Gauche</option>
                    <option value="R">→ Droite</option>
                    <option value="N">⊙ Aucun</option>
                  </select>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={handleAdd}
            className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            ➕ Ajouter la transition
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher une ligne de transition
function TransitionDisplayRow({ 
  transition, 
  numTapes, 
  onEdit, 
  onDelete 
}: { 
  transition: TuringTransition; 
  numTapes: number; 
  onEdit: () => void; 
  onDelete: () => void;
}) {
  return (
    <>
      <td className="px-3 py-2 border">
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-mono">
          {transition.current_state}
        </span>
      </td>
      <td className="px-3 py-2 border">
        {numTapes === 1 ? (
          <span className="font-mono">{transition.read_symbol}</span>
        ) : (
          <span className="font-mono text-xs">[{transition.read_symbols?.join(', ')}]</span>
        )}
      </td>
      <td className="px-3 py-2 border">
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">
          {transition.next_state}
        </span>
      </td>
      <td className="px-3 py-2 border">
        {numTapes === 1 ? (
          <span className="font-mono">{transition.write_symbol}</span>
        ) : (
          <span className="font-mono text-xs">[{transition.write_symbols?.join(', ')}]</span>
        )}
      </td>
      <td className="px-3 py-2 border">
        {numTapes === 1 ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            {transition.move_direction}
          </span>
        ) : (
          <span className="font-mono text-xs">[{transition.move_directions?.join(', ')}]</span>
        )}
      </td>
      <td className="px-3 py-2 border text-center">
        <div className="flex justify-center space-x-2">
          <button
            onClick={onEdit}
            className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
          >
            ✏️ Modifier
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs"
          >
            🗑️ Supprimer
          </button>
        </div>
      </td>
    </>
  );
}

// Composant pour éditer une ligne de transition
function TransitionEditRow({ 
  transition, 
  numTapes, 
  onSave, 
  onCancel 
}: { 
  transition: TuringTransition; 
  numTapes: number; 
  onSave: (trans: TuringTransition) => void; 
  onCancel: () => void;
}) {
  const [edited, setEdited] = useState<TuringTransition>(transition);
  
  return (
    <>
      <td className="px-2 py-2 border" colSpan={numTapes === 1 ? 5 : 5}>
        <div className="space-y-2">
          {numTapes === 1 ? (
            <div className="grid grid-cols-5 gap-2">
              <input
                type="text"
                value={edited.current_state}
                onChange={(e) => setEdited({ ...edited, current_state: e.target.value })}
                className="px-2 py-1 border rounded text-sm"
              />
              <input
                type="text"
                maxLength={1}
                value={edited.read_symbol || ''}
                onChange={(e) => setEdited({ ...edited, read_symbol: e.target.value })}
                className="px-2 py-1 border rounded text-sm"
              />
              <input
                type="text"
                value={edited.next_state}
                onChange={(e) => setEdited({ ...edited, next_state: e.target.value })}
                className="px-2 py-1 border rounded text-sm"
              />
              <input
                type="text"
                maxLength={1}
                value={edited.write_symbol || ''}
                onChange={(e) => setEdited({ ...edited, write_symbol: e.target.value })}
                className="px-2 py-1 border rounded text-sm"
              />
              <select
                value={edited.move_direction || 'N'}
                onChange={(e) => setEdited({ ...edited, move_direction: e.target.value as MoveDirection })}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="L">L</option>
                <option value="R">R</option>
                <option value="N">N</option>
              </select>
            </div>
          ) : (
            <div>Multi-rubans editing...</div>
          )}
          <div className="flex space-x-2">
            <button
              onClick={() => onSave(edited)}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
            >
              ✓ Enregistrer
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-xs"
            >
              ✗ Annuler
            </button>
          </div>
        </div>
      </td>
      <td className="px-2 py-2 border"></td>
    </>
  );
}
