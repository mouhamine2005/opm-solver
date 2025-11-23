/**
 * Types TypeScript pour le simulateur de Machine de Turing
 * Supporte machines mono-ruban et multi-rubans
 * @author OPM Solver Pro
 * @year 2024
 */

export type MoveDirection = 'L' | 'R' | 'N';

/**
 * Règle de transition pour machine de Turing
 * Supporte mono-ruban (read_symbol, write_symbol, move_direction)
 * et multi-rubans (read_symbols, write_symbols, move_directions)
 */
export interface TuringTransition {
  current_state: string;
  next_state: string;
  
  // Mono-ruban
  read_symbol?: string;
  write_symbol?: string;
  move_direction?: MoveDirection;
  
  // Multi-rubans
  read_symbols?: string[];
  write_symbols?: string[];
  move_directions?: MoveDirection[];
}

/**
 * Requête pour simuler une machine de Turing
 */
export interface TuringMachineRequest {
  // Rubans (spécifier soit initial_tape OU initial_tapes)
  initial_tape?: string;
  initial_tapes?: string[];
  
  // Configuration de base
  blank_symbol?: string;
  initial_state?: string;
  final_states: string[];
  transitions: TuringTransition[];
  
  // Paramètres d'exécution
  max_steps?: number;
  head_position?: number;
  head_positions?: number[];
  detect_loops?: boolean;
}

/**
 * Une étape d'exécution de la machine
 */
export interface TuringExecutionStep {
  step_number: number;
  current_state: string;
  tape_contents: string[];
  head_positions: number[];
  symbols_read: string[];
  action_taken?: string;
}

/**
 * Frame d'animation pour visualisation
 */
export interface TuringAnimationFrame {
  step: number;
  state: string;
  tapes: string[];
  heads: number[];
  action?: string;
}

/**
 * Réponse de la simulation
 */
export interface TuringMachineResponse {
  success: boolean;
  accepted?: boolean;
  final_tapes?: string[];
  final_state?: string;
  execution_steps: TuringExecutionStep[];
  total_steps: number;
  halted: boolean;
  halt_reason?: string;
  loop_detected: boolean;
  execution_time: number;
  message?: string;
  num_tapes: number;
  animation_frames?: TuringAnimationFrame[];
}

/**
 * Exemple pré-configuré de machine de Turing
 */
export interface TuringExample {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'arithmetic' | 'string' | 'advanced';
  num_tapes: number;
  initial_tape?: string;
  initial_tapes?: string[];
  initial_state: string;
  final_states: string[];
  transitions: TuringTransition[];
  expected_result?: string;
  complexity?: string;
}

/**
 * État de l'animation (contrôles play/pause/speed)
 */
export interface AnimationState {
  isPlaying: boolean;
  currentFrame: number;
  speed: number; // millisecondes par frame
  totalFrames: number;
}

/**
 * Statistiques d'exécution
 */
export interface ExecutionStats {
  total_steps: number;
  execution_time: number;
  states_visited: string[];
  unique_configurations: number;
  tape_size_max: number;
  accepted: boolean;
  halt_reason?: string;
}
