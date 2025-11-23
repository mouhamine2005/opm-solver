// Types pour les matrices et vecteurs
export interface Matrix {
  data: number[][];
}

export interface Vector {
  data: number[];
}

// Types pour les requêtes API
export interface SolveRequest {
  matrix_a: Matrix;
  vector_b: Vector;
  method: 'gauss' | 'lu';
}

export interface SolveResponse {
  success: boolean;
  solution: number[];
  residual_error: number;
  method: string;
  execution_time: number;
  matrix_condition: number;
  determinant: number;
  message?: string;
}

export interface AnalysisRequest {
  matrix_a: Matrix;
  vector_b?: Vector;
}

export interface AnalysisResponse {
  success: boolean;
  determinant: number;
  condition_number: number;
  is_singular: boolean;
  is_symmetric: boolean;
  is_positive_definite?: boolean;
  eigenvalues?: number[];
  rank: number;
  properties: Record<string, any>;
  recommendations: string[];
  execution_time: number;
}

export interface DecomposeLURequest {
  matrix_a: Matrix;
}

export interface DecomposeLUResponse {
  success: boolean;
  matrix_l: number[][];
  matrix_u: number[][];
  execution_time: number;
  message?: string;
}
