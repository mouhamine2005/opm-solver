/**
 * Bibliothèque d'exemples de machines de Turing classiques
 * @author OPM Solver Pro
 * @year 2024
 */

import type { TuringExample } from '@/types/turing';

export const TURING_EXAMPLES: TuringExample[] = [
  {
    id: 'multiplication_binary',
    name: 'Multiplication Binaire Complète',
    description: 'Multiplie deux nombres binaires (ex: 101 × 11 → 1111, soit 5×3=15)',
    category: 'arithmetic',
    num_tapes: 1,
    initial_tape: '101*11',
    initial_state: 'q_start',
    final_states: ['q_accept'],
    transitions: [
      // Phase 1: Marquer le premier nombre
      { current_state: 'q_start', read_symbol: '0', next_state: 'q_mark1', write_symbol: 'A', move_direction: 'R' },
      { current_state: 'q_start', read_symbol: '1', next_state: 'q_mark1', write_symbol: 'B', move_direction: 'R' },
      { current_state: 'q_mark1', read_symbol: '0', next_state: 'q_mark1', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_mark1', read_symbol: '1', next_state: 'q_mark1', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_mark1', read_symbol: '*', next_state: 'q_mark2', write_symbol: '*', move_direction: 'R' },
      
      // Phase 2: Marquer le deuxième nombre
      { current_state: 'q_mark2', read_symbol: '0', next_state: 'q_scan', write_symbol: 'C', move_direction: 'R' },
      { current_state: 'q_mark2', read_symbol: '1', next_state: 'q_scan', write_symbol: 'D', move_direction: 'R' },
      { current_state: 'q_scan', read_symbol: '0', next_state: 'q_scan', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_scan', read_symbol: '1', next_state: 'q_scan', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_scan', read_symbol: '_', next_state: 'q_write', write_symbol: '_', move_direction: 'L' },
      
      // Phase 3: Retour et copie
      { current_state: 'q_write', read_symbol: '0', next_state: 'q_write', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_write', read_symbol: '1', next_state: 'q_write', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_write', read_symbol: 'A', next_state: 'q_copy0', write_symbol: 'A', move_direction: 'R' },
      { current_state: 'q_write', read_symbol: 'B', next_state: 'q_copy1', write_symbol: 'B', move_direction: 'R' },
      
      // Phase 4: Copier selon le bit (0 ou 1)
      { current_state: 'q_copy0', read_symbol: '0', next_state: 'q_copy0', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_copy0', read_symbol: '1', next_state: 'q_copy0', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_copy0', read_symbol: '*', next_state: 'q_skip', write_symbol: '*', move_direction: 'R' },
      { current_state: 'q_skip', read_symbol: 'C', next_state: 'q_skip', write_symbol: 'C', move_direction: 'R' },
      { current_state: 'q_skip', read_symbol: 'D', next_state: 'q_skip', write_symbol: 'D', move_direction: 'R' },
      { current_state: 'q_skip', read_symbol: '0', next_state: 'q_skip', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_skip', read_symbol: '1', next_state: 'q_skip', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_skip', read_symbol: '_', next_state: 'q_next', write_symbol: '0', move_direction: 'L' },
      
      { current_state: 'q_copy1', read_symbol: '0', next_state: 'q_copy1', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_copy1', read_symbol: '1', next_state: 'q_copy1', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_copy1', read_symbol: '*', next_state: 'q_add', write_symbol: '*', move_direction: 'R' },
      { current_state: 'q_add', read_symbol: 'C', next_state: 'q_add', write_symbol: 'C', move_direction: 'R' },
      { current_state: 'q_add', read_symbol: 'D', next_state: 'q_add', write_symbol: 'D', move_direction: 'R' },
      { current_state: 'q_add', read_symbol: '0', next_state: 'q_add', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_add', read_symbol: '1', next_state: 'q_add', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_add', read_symbol: '_', next_state: 'q_next', write_symbol: '1', move_direction: 'L' },
      
      // Phase 5: Continuer ou terminer
      { current_state: 'q_next', read_symbol: '0', next_state: 'q_next', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_next', read_symbol: '1', next_state: 'q_next', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_next', read_symbol: 'C', next_state: 'q_next', write_symbol: 'C', move_direction: 'L' },
      { current_state: 'q_next', read_symbol: 'D', next_state: 'q_next', write_symbol: 'D', move_direction: 'L' },
      { current_state: 'q_next', read_symbol: '*', next_state: 'q_check', write_symbol: '*', move_direction: 'L' },
      { current_state: 'q_check', read_symbol: '0', next_state: 'q_check', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_check', read_symbol: '1', next_state: 'q_check', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_check', read_symbol: 'A', next_state: 'q_write', write_symbol: 'A', move_direction: 'R' },
      { current_state: 'q_check', read_symbol: 'B', next_state: 'q_write', write_symbol: 'B', move_direction: 'R' },
      { current_state: 'q_check', read_symbol: '_', next_state: 'q_clean', write_symbol: '_', move_direction: 'R' },
      
      // Phase 6: Nettoyage final
      { current_state: 'q_clean', read_symbol: 'A', next_state: 'q_clean', write_symbol: '_', move_direction: 'R' },
      { current_state: 'q_clean', read_symbol: 'B', next_state: 'q_clean', write_symbol: '_', move_direction: 'R' },
      { current_state: 'q_clean', read_symbol: '0', next_state: 'q_clean', write_symbol: '_', move_direction: 'R' },
      { current_state: 'q_clean', read_symbol: '1', next_state: 'q_clean', write_symbol: '_', move_direction: 'R' },
      { current_state: 'q_clean', read_symbol: '*', next_state: 'q_clean2', write_symbol: '_', move_direction: 'R' },
      { current_state: 'q_clean2', read_symbol: 'C', next_state: 'q_clean2', write_symbol: '_', move_direction: 'R' },
      { current_state: 'q_clean2', read_symbol: 'D', next_state: 'q_clean2', write_symbol: '_', move_direction: 'R' },
      { current_state: 'q_clean2', read_symbol: '0', next_state: 'q_accept', write_symbol: '0', move_direction: 'N' },
      { current_state: 'q_clean2', read_symbol: '1', next_state: 'q_accept', write_symbol: '1', move_direction: 'N' },
    ],
    expected_result: '1111',
    complexity: 'O(n²)'
  },

  {
    id: 'binary_increment',
    name: 'Incrémentation binaire',
    description: 'Ajoute 1 à un nombre binaire (ex: 1011 → 1100)',
    category: 'arithmetic',
    num_tapes: 1,
    initial_tape: '1011',
    initial_state: 'q0',
    final_states: ['q_halt'],
    transitions: [
      { current_state: 'q0', read_symbol: '0', next_state: 'q0', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q0', read_symbol: '1', next_state: 'q0', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q0', read_symbol: '_', next_state: 'q1', write_symbol: '_', move_direction: 'L' },
      { current_state: 'q1', read_symbol: '0', next_state: 'q_halt', write_symbol: '1', move_direction: 'N' },
      { current_state: 'q1', read_symbol: '1', next_state: 'q1', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q1', read_symbol: '_', next_state: 'q_halt', write_symbol: '1', move_direction: 'N' },
    ],
    expected_result: '1100',
    complexity: 'O(n)'
  },

  {
    id: 'unary_addition',
    name: 'Addition unaire',
    description: 'Additionne deux nombres en notation unaire (1+11 → 111)',
    category: 'arithmetic',
    num_tapes: 1,
    initial_tape: '1+11',
    initial_state: 'q0',
    final_states: ['q_halt'],
    transitions: [
      { current_state: 'q0', read_symbol: '1', next_state: 'q0', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q0', read_symbol: '+', next_state: 'q1', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q1', read_symbol: '1', next_state: 'q1', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q1', read_symbol: '_', next_state: 'q_halt', write_symbol: '_', move_direction: 'N' },
    ],
    expected_result: '1111',
    complexity: 'O(n)'
  },

  {
    id: 'binary_reverse',
    name: 'Inversion binaire',
    description: 'Inverse une chaîne binaire (101 → 101)',
    category: 'string',
    num_tapes: 1,
    initial_tape: '10110',
    initial_state: 'q0',
    final_states: ['q_accept'],
    transitions: [
      // Marquer le premier symbole
      { current_state: 'q0', read_symbol: '0', next_state: 'q1_0', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: '1', next_state: 'q1_1', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: 'X', next_state: 'q_accept', write_symbol: 'X', move_direction: 'N' },
      
      // Aller à la fin pour 0
      { current_state: 'q1_0', read_symbol: '0', next_state: 'q1_0', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q1_0', read_symbol: '1', next_state: 'q1_0', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q1_0', read_symbol: 'Y', next_state: 'q1_0', write_symbol: 'Y', move_direction: 'R' },
      { current_state: 'q1_0', read_symbol: '_', next_state: 'q2_0', write_symbol: '_', move_direction: 'L' },
      
      // Marquer le dernier symbole avec 0
      { current_state: 'q2_0', read_symbol: '0', next_state: 'q3', write_symbol: 'Y', move_direction: 'L' },
      { current_state: 'q2_0', read_symbol: '1', next_state: 'q3', write_symbol: 'Y', move_direction: 'L' },
      { current_state: 'q2_0', read_symbol: 'Y', next_state: 'q2_0', write_symbol: 'Y', move_direction: 'L' },
      
      // Retour au début
      { current_state: 'q3', read_symbol: '0', next_state: 'q3', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q3', read_symbol: '1', next_state: 'q3', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q3', read_symbol: 'Y', next_state: 'q3', write_symbol: 'Y', move_direction: 'L' },
      { current_state: 'q3', read_symbol: 'X', next_state: 'q0', write_symbol: 'X', move_direction: 'R' },
    ],
    complexity: 'O(n²)'
  },

  {
    id: 'duplicate_string',
    name: 'Duplication de chaîne',
    description: 'Duplique une chaîne (abc → abcabc)',
    category: 'string',
    num_tapes: 1,
    initial_tape: 'abc',
    initial_state: 'q0',
    final_states: ['q_halt'],
    transitions: [
      // Marquer et mémoriser 'a'
      { current_state: 'q0', read_symbol: 'a', next_state: 'q_a', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: 'b', next_state: 'q_b', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: 'c', next_state: 'q_c', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: 'X', next_state: 'q_copy', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: '_', next_state: 'q_halt', write_symbol: '_', move_direction: 'N' },
      
      // Aller à la fin et écrire 'a'
      { current_state: 'q_a', read_symbol: 'a', next_state: 'q_a', write_symbol: 'a', move_direction: 'R' },
      { current_state: 'q_a', read_symbol: 'b', next_state: 'q_a', write_symbol: 'b', move_direction: 'R' },
      { current_state: 'q_a', read_symbol: 'c', next_state: 'q_a', write_symbol: 'c', move_direction: 'R' },
      { current_state: 'q_a', read_symbol: 'X', next_state: 'q_a', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_a', read_symbol: '_', next_state: 'q_back', write_symbol: 'a', move_direction: 'L' },
      
      // Similaire pour 'b' et 'c'...
      { current_state: 'q_b', read_symbol: 'a', next_state: 'q_b', write_symbol: 'a', move_direction: 'R' },
      { current_state: 'q_b', read_symbol: 'b', next_state: 'q_b', write_symbol: 'b', move_direction: 'R' },
      { current_state: 'q_b', read_symbol: 'c', next_state: 'q_b', write_symbol: 'c', move_direction: 'R' },
      { current_state: 'q_b', read_symbol: 'X', next_state: 'q_b', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_b', read_symbol: '_', next_state: 'q_back', write_symbol: 'b', move_direction: 'L' },
      
      // Retour
      { current_state: 'q_back', read_symbol: 'a', next_state: 'q_back', write_symbol: 'a', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: 'b', next_state: 'q_back', write_symbol: 'b', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: 'c', next_state: 'q_back', write_symbol: 'c', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: 'X', next_state: 'q0', write_symbol: 'X', move_direction: 'R' },
    ],
    complexity: 'O(n²)'
  },

  {
    id: 'balanced_parentheses',
    name: 'Parenthèses équilibrées',
    description: 'Vérifie si les parenthèses sont équilibrées',
    category: 'basic',
    num_tapes: 1,
    initial_tape: '(())',
    initial_state: 'q0',
    final_states: ['q_accept'],
    transitions: [
      // Chercher une paire ( )
      { current_state: 'q0', read_symbol: '(', next_state: 'q1', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: 'X', next_state: 'q0', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
      
      // Chercher )
      { current_state: 'q1', read_symbol: '(', next_state: 'q1', write_symbol: '(', move_direction: 'R' },
      { current_state: 'q1', read_symbol: 'X', next_state: 'q1', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q1', read_symbol: ')', next_state: 'q2', write_symbol: 'X', move_direction: 'L' },
      
      // Retour
      { current_state: 'q2', read_symbol: '(', next_state: 'q2', write_symbol: '(', move_direction: 'L' },
      { current_state: 'q2', read_symbol: 'X', next_state: 'q2', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q2', read_symbol: '_', next_state: 'q0', write_symbol: '_', move_direction: 'R' },
    ],
    complexity: 'O(n²)'
  },

  {
    id: 'copy_string_2tape',
    name: 'Copie (2 rubans)',
    description: 'Copie le contenu du ruban 1 vers le ruban 2',
    category: 'string',
    num_tapes: 2,
    initial_tapes: ['abc', ''],
    initial_state: 'q0',
    final_states: ['q_accept'],
    transitions: [
      { current_state: 'q0', read_symbols: ['a', '_'], next_state: 'q0', write_symbols: ['a', 'a'], move_directions: ['R', 'R'] },
      { current_state: 'q0', read_symbols: ['b', '_'], next_state: 'q0', write_symbols: ['b', 'b'], move_directions: ['R', 'R'] },
      { current_state: 'q0', read_symbols: ['c', '_'], next_state: 'q0', write_symbols: ['c', 'c'], move_directions: ['R', 'R'] },
      { current_state: 'q0', read_symbols: ['_', '_'], next_state: 'q_accept', write_symbols: ['_', '_'], move_directions: ['N', 'N'] },
    ],
    expected_result: 'Ruban 2: abc',
    complexity: 'O(n)'
  },

  {
    id: 'palindrome_checker',
    name: 'Vérificateur de palindrome',
    description: 'Vérifie si une chaîne binaire est un palindrome',
    category: 'string',
    num_tapes: 1,
    initial_tape: '10101',
    initial_state: 'q0',
    final_states: ['q_accept'],
    transitions: [
      // Cas de base
      { current_state: 'q0', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
      { current_state: 'q0', read_symbol: 'X', next_state: 'q_check', write_symbol: 'X', move_direction: 'R' },
      
      // Marquer premier 0
      { current_state: 'q0', read_symbol: '0', next_state: 'q_0_end', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q0', read_symbol: '1', next_state: 'q_1_end', write_symbol: 'X', move_direction: 'R' },
      
      // Aller à la fin pour vérifier 0
      { current_state: 'q_0_end', read_symbol: '0', next_state: 'q_0_end', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_0_end', read_symbol: '1', next_state: 'q_0_end', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_0_end', read_symbol: 'X', next_state: 'q_0_end', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_0_end', read_symbol: '_', next_state: 'q_0_check', write_symbol: '_', move_direction: 'L' },
      
      // Vérifier dernier est 0
      { current_state: 'q_0_check', read_symbol: '0', next_state: 'q_return', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_0_check', read_symbol: 'X', next_state: 'q_check', write_symbol: 'X', move_direction: 'L' },
      
      // Retour au début
      { current_state: 'q_return', read_symbol: '0', next_state: 'q_return', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_return', read_symbol: '1', next_state: 'q_return', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_return', read_symbol: 'X', next_state: 'q_return', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_return', read_symbol: '_', next_state: 'q0', write_symbol: '_', move_direction: 'R' },
      
      // Vérification finale
      { current_state: 'q_check', read_symbol: 'X', next_state: 'q_check', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_check', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
    ],
    complexity: 'O(n²)'
  },

  {
    id: 'busy_beaver_2',
    name: 'Busy Beaver (2 états)',
    description: 'Machine qui écrit le maximum de 1 avec 2 états',
    category: 'advanced',
    num_tapes: 1,
    initial_tape: '_',
    initial_state: 'A',
    final_states: ['HALT'],
    transitions: [
      { current_state: 'A', read_symbol: '_', next_state: 'B', write_symbol: '1', move_direction: 'R' },
      { current_state: 'A', read_symbol: '1', next_state: 'B', write_symbol: '1', move_direction: 'L' },
      { current_state: 'B', read_symbol: '_', next_state: 'A', write_symbol: '1', move_direction: 'L' },
      { current_state: 'B', read_symbol: '1', next_state: 'HALT', write_symbol: '1', move_direction: 'R' },
    ],
    expected_result: '1111',
    complexity: '6 étapes'
  },

  {
    id: 'sorting_algorithm',
    name: 'Tri à Bulles (Bubble Sort)',
    description: 'Trie une séquence de chiffres par ordre croissant (ex: 3142 → 1234)',
    category: 'advanced',
    num_tapes: 1,
    initial_tape: '3142',
    initial_state: 'q_start',
    final_states: ['q_accept'],
    transitions: [
      // Phase 1: Scanner et trouver une paire non triée
      { current_state: 'q_start', read_symbol: '_', next_state: 'q_verify', write_symbol: '_', move_direction: 'L' },
      { current_state: 'q_start', read_symbol: '0', next_state: 'q_cmp_0', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_start', read_symbol: '1', next_state: 'q_cmp_1', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_start', read_symbol: '2', next_state: 'q_cmp_2', write_symbol: '2', move_direction: 'R' },
      { current_state: 'q_start', read_symbol: '3', next_state: 'q_cmp_3', write_symbol: '3', move_direction: 'R' },
      { current_state: 'q_start', read_symbol: '4', next_state: 'q_cmp_4', write_symbol: '4', move_direction: 'R' },
      
      // Comparer avec 0
      { current_state: 'q_cmp_0', read_symbol: '0', next_state: 'q_start', write_symbol: '0', move_direction: 'R' },
      { current_state: 'q_cmp_0', read_symbol: '1', next_state: 'q_start', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_cmp_0', read_symbol: '2', next_state: 'q_start', write_symbol: '2', move_direction: 'R' },
      { current_state: 'q_cmp_0', read_symbol: '3', next_state: 'q_start', write_symbol: '3', move_direction: 'R' },
      { current_state: 'q_cmp_0', read_symbol: '4', next_state: 'q_start', write_symbol: '4', move_direction: 'R' },
      { current_state: 'q_cmp_0', read_symbol: '_', next_state: 'q_start', write_symbol: '_', move_direction: 'L' },
      
      // Comparer avec 1
      { current_state: 'q_cmp_1', read_symbol: '0', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_1', read_symbol: '1', next_state: 'q_start', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_cmp_1', read_symbol: '2', next_state: 'q_start', write_symbol: '2', move_direction: 'R' },
      { current_state: 'q_cmp_1', read_symbol: '3', next_state: 'q_start', write_symbol: '3', move_direction: 'R' },
      { current_state: 'q_cmp_1', read_symbol: '4', next_state: 'q_start', write_symbol: '4', move_direction: 'R' },
      { current_state: 'q_cmp_1', read_symbol: '_', next_state: 'q_start', write_symbol: '_', move_direction: 'L' },
      
      // Comparer avec 2
      { current_state: 'q_cmp_2', read_symbol: '0', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_2', read_symbol: '1', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_2', read_symbol: '2', next_state: 'q_start', write_symbol: '2', move_direction: 'R' },
      { current_state: 'q_cmp_2', read_symbol: '3', next_state: 'q_start', write_symbol: '3', move_direction: 'R' },
      { current_state: 'q_cmp_2', read_symbol: '4', next_state: 'q_start', write_symbol: '4', move_direction: 'R' },
      { current_state: 'q_cmp_2', read_symbol: '_', next_state: 'q_start', write_symbol: '_', move_direction: 'L' },
      
      // Comparer avec 3
      { current_state: 'q_cmp_3', read_symbol: '0', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_3', read_symbol: '1', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_3', read_symbol: '2', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_3', read_symbol: '3', next_state: 'q_start', write_symbol: '3', move_direction: 'R' },
      { current_state: 'q_cmp_3', read_symbol: '4', next_state: 'q_start', write_symbol: '4', move_direction: 'R' },
      { current_state: 'q_cmp_3', read_symbol: '_', next_state: 'q_start', write_symbol: '_', move_direction: 'L' },
      
      // Comparer avec 4
      { current_state: 'q_cmp_4', read_symbol: '0', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_4', read_symbol: '1', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_4', read_symbol: '2', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_4', read_symbol: '3', next_state: 'q_swap', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_cmp_4', read_symbol: '4', next_state: 'q_start', write_symbol: '4', move_direction: 'R' },
      { current_state: 'q_cmp_4', read_symbol: '_', next_state: 'q_start', write_symbol: '_', move_direction: 'L' },
      
      // Échanger les éléments
      { current_state: 'q_swap', read_symbol: '0', next_state: 'q_write_0', write_symbol: 'Y', move_direction: 'R' },
      { current_state: 'q_swap', read_symbol: '1', next_state: 'q_write_1', write_symbol: 'Y', move_direction: 'R' },
      { current_state: 'q_swap', read_symbol: '2', next_state: 'q_write_2', write_symbol: 'Y', move_direction: 'R' },
      { current_state: 'q_swap', read_symbol: '3', next_state: 'q_write_3', write_symbol: 'Y', move_direction: 'R' },
      { current_state: 'q_swap', read_symbol: '4', next_state: 'q_write_4', write_symbol: 'Y', move_direction: 'R' },
      
      // Écrire les valeurs échangées
      { current_state: 'q_write_0', read_symbol: 'X', next_state: 'q_restore', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_write_1', read_symbol: 'X', next_state: 'q_restore', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_write_2', read_symbol: 'X', next_state: 'q_restore', write_symbol: '2', move_direction: 'L' },
      { current_state: 'q_write_3', read_symbol: 'X', next_state: 'q_restore', write_symbol: '3', move_direction: 'L' },
      { current_state: 'q_write_4', read_symbol: 'X', next_state: 'q_restore', write_symbol: '4', move_direction: 'L' },
      
      // Restaurer la première valeur
      { current_state: 'q_restore', read_symbol: 'Y', next_state: 'q_back', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: '0', next_state: 'q_back', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: '1', next_state: 'q_back', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: '2', next_state: 'q_back', write_symbol: '2', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: '3', next_state: 'q_back', write_symbol: '3', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: '4', next_state: 'q_back', write_symbol: '4', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: 'X', next_state: 'q_back', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_back', read_symbol: '_', next_state: 'q_restart', write_symbol: '_', move_direction: 'R' },
      
      // Recommencer
      { current_state: 'q_restart', read_symbol: 'X', next_state: 'q_restart', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_restart', read_symbol: '0', next_state: 'q_start', write_symbol: '0', move_direction: 'N' },
      { current_state: 'q_restart', read_symbol: '1', next_state: 'q_start', write_symbol: '1', move_direction: 'N' },
      { current_state: 'q_restart', read_symbol: '2', next_state: 'q_start', write_symbol: '2', move_direction: 'N' },
      { current_state: 'q_restart', read_symbol: '3', next_state: 'q_start', write_symbol: '3', move_direction: 'N' },
      { current_state: 'q_restart', read_symbol: '4', next_state: 'q_start', write_symbol: '4', move_direction: 'N' },
      
      // Vérification finale
      { current_state: 'q_verify', read_symbol: '0', next_state: 'q_v0', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_verify', read_symbol: '1', next_state: 'q_v1', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_verify', read_symbol: '2', next_state: 'q_v2', write_symbol: '2', move_direction: 'L' },
      { current_state: 'q_verify', read_symbol: '3', next_state: 'q_v3', write_symbol: '3', move_direction: 'L' },
      { current_state: 'q_verify', read_symbol: '4', next_state: 'q_v4', write_symbol: '4', move_direction: 'L' },
      { current_state: 'q_verify', read_symbol: 'X', next_state: 'q_verify', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_verify', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
      
      { current_state: 'q_v0', read_symbol: '0', next_state: 'q_verify', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_v0', read_symbol: 'X', next_state: 'q_verify', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_v0', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
      
      { current_state: 'q_v1', read_symbol: '0', next_state: 'q_verify', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_v1', read_symbol: '1', next_state: 'q_verify', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_v1', read_symbol: 'X', next_state: 'q_verify', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_v1', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
      
      { current_state: 'q_v2', read_symbol: '0', next_state: 'q_verify', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_v2', read_symbol: '1', next_state: 'q_verify', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_v2', read_symbol: '2', next_state: 'q_verify', write_symbol: '2', move_direction: 'L' },
      { current_state: 'q_v2', read_symbol: 'X', next_state: 'q_verify', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_v2', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
      
      { current_state: 'q_v3', read_symbol: '0', next_state: 'q_verify', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_v3', read_symbol: '1', next_state: 'q_verify', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_v3', read_symbol: '2', next_state: 'q_verify', write_symbol: '2', move_direction: 'L' },
      { current_state: 'q_v3', read_symbol: '3', next_state: 'q_verify', write_symbol: '3', move_direction: 'L' },
      { current_state: 'q_v3', read_symbol: 'X', next_state: 'q_verify', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_v3', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
      
      { current_state: 'q_v4', read_symbol: '0', next_state: 'q_verify', write_symbol: '0', move_direction: 'L' },
      { current_state: 'q_v4', read_symbol: '1', next_state: 'q_verify', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_v4', read_symbol: '2', next_state: 'q_verify', write_symbol: '2', move_direction: 'L' },
      { current_state: 'q_v4', read_symbol: '3', next_state: 'q_verify', write_symbol: '3', move_direction: 'L' },
      { current_state: 'q_v4', read_symbol: '4', next_state: 'q_verify', write_symbol: '4', move_direction: 'L' },
      { current_state: 'q_v4', read_symbol: 'X', next_state: 'q_verify', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_v4', read_symbol: '_', next_state: 'q_accept', write_symbol: '_', move_direction: 'N' },
    ],
    expected_result: '1234',
    complexity: 'O(n²)'
  },

  {
    id: 'prime_checker',
    name: 'Vérificateur de Nombre Premier',
    description: 'Vérifie si un nombre en unaire est premier (ex: 11111 → OUI pour 5)',
    category: 'advanced',
    num_tapes: 1,
    initial_tape: '11111',
    initial_state: 'q_start',
    final_states: ['q_prime', 'q_composite'],
    transitions: [
      // Étape 1: Vérifier si n >= 2
      { current_state: 'q_start', read_symbol: '1', next_state: 'q_check2', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_check2', read_symbol: '1', next_state: 'q_init', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_check2', read_symbol: '_', next_state: 'q_composite', write_symbol: '_', move_direction: 'N' },
      
      // Étape 2: Initialiser le diviseur d = 2
      { current_state: 'q_init', read_symbol: '1', next_state: 'q_init', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_init', read_symbol: '_', next_state: 'q_mark_d', write_symbol: '#', move_direction: 'L' },
      { current_state: 'q_mark_d', read_symbol: '1', next_state: 'q_d2', write_symbol: 'D', move_direction: 'L' },
      { current_state: 'q_d2', read_symbol: '1', next_state: 'q_test', write_symbol: 'D', move_direction: 'L' },
      
      // Étape 3: Tester la divisibilité
      { current_state: 'q_test', read_symbol: '1', next_state: 'q_test', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_test', read_symbol: '_', next_state: 'q_divide', write_symbol: '_', move_direction: 'R' },
      
      // Étape 4: Diviser n par d
      { current_state: 'q_divide', read_symbol: '1', next_state: 'q_mark_n', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_mark_n', read_symbol: '1', next_state: 'q_mark_n', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_mark_n', read_symbol: 'X', next_state: 'q_mark_n', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_mark_n', read_symbol: 'D', next_state: 'q_count_d', write_symbol: 'D', move_direction: 'R' },
      { current_state: 'q_count_d', read_symbol: 'D', next_state: 'q_sub', write_symbol: 'D', move_direction: 'L' },
      { current_state: 'q_count_d', read_symbol: '#', next_state: 'q_check_rest', write_symbol: '#', move_direction: 'L' },
      
      // Étape 5: Soustraire d de n
      { current_state: 'q_sub', read_symbol: 'D', next_state: 'q_sub', write_symbol: 'D', move_direction: 'L' },
      { current_state: 'q_sub', read_symbol: 'X', next_state: 'q_sub', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_sub', read_symbol: '1', next_state: 'q_mark_sub', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_mark_sub', read_symbol: 'X', next_state: 'q_mark_sub', write_symbol: 'X', move_direction: 'R' },
      { current_state: 'q_mark_sub', read_symbol: 'D', next_state: 'q_count_d', write_symbol: 'D', move_direction: 'R' },
      
      // Étape 6: Vérifier le reste
      { current_state: 'q_check_rest', read_symbol: 'D', next_state: 'q_check_rest', write_symbol: 'D', move_direction: 'L' },
      { current_state: 'q_check_rest', read_symbol: 'X', next_state: 'q_has_rest', write_symbol: 'X', move_direction: 'L' },
      { current_state: 'q_check_rest', read_symbol: '1', next_state: 'q_has_rest', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_check_rest', read_symbol: '_', next_state: 'q_composite', write_symbol: '_', move_direction: 'N' },
      
      // Étape 7: Incrémenter d et recommencer
      { current_state: 'q_has_rest', read_symbol: 'X', next_state: 'q_has_rest', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_has_rest', read_symbol: '1', next_state: 'q_has_rest', write_symbol: '1', move_direction: 'L' },
      { current_state: 'q_has_rest', read_symbol: '_', next_state: 'q_reset', write_symbol: '_', move_direction: 'R' },
      { current_state: 'q_reset', read_symbol: '1', next_state: 'q_reset', write_symbol: '1', move_direction: 'R' },
      { current_state: 'q_reset', read_symbol: 'D', next_state: 'q_inc_d', write_symbol: 'D', move_direction: 'R' },
      { current_state: 'q_inc_d', read_symbol: 'D', next_state: 'q_inc_d', write_symbol: 'D', move_direction: 'R' },
      { current_state: 'q_inc_d', read_symbol: '#', next_state: 'q_add_d', write_symbol: 'D', move_direction: 'L' },
      { current_state: 'q_add_d', read_symbol: 'D', next_state: 'q_check_sqrt', write_symbol: 'D', move_direction: 'L' },
      
      // Étape 8: Vérifier si d² > n
      { current_state: 'q_check_sqrt', read_symbol: 'D', next_state: 'q_check_sqrt', write_symbol: 'D', move_direction: 'L' },
      { current_state: 'q_check_sqrt', read_symbol: '1', next_state: 'q_prime', write_symbol: '1', move_direction: 'N' },
      { current_state: 'q_check_sqrt', read_symbol: '_', next_state: 'q_test', write_symbol: '_', move_direction: 'R' },
    ],
    expected_result: 'PRIME (accepté)',
    complexity: 'O(n√n)'
  },
];

/**
 * Obtenir les exemples par catégorie
 */
export function getExamplesByCategory(category: string): TuringExample[] {
  return TURING_EXAMPLES.filter(ex => ex.category === category);
}

/**
 * Obtenir un exemple par ID
 */
export function getExampleById(id: string): TuringExample | undefined {
  return TURING_EXAMPLES.find(ex => ex.id === id);
}

/**
 * Obtenir toutes les catégories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(TURING_EXAMPLES.map(ex => ex.category)));
}
