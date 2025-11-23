import axios from 'axios';
import type { SolveRequest, SolveResponse, AnalysisRequest, AnalysisResponse, DecomposeLURequest, DecomposeLUResponse } from '@/types';
import type { TuringMachineRequest, TuringMachineResponse } from '@/types/turing';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const solverApi = {
  // Résoudre un système linéaire
  solve: async (request: SolveRequest): Promise<SolveResponse> => {
    const response = await api.post<SolveResponse>('/api/v1/solve', request);
    return response.data;
  },

  // Analyser une matrice
  analyze: async (request: AnalysisRequest): Promise<AnalysisResponse> => {
    const response = await api.post<AnalysisResponse>('/api/v1/analyze', request);
    return response.data;
  },

  // Décomposition LU
  decomposeLU: async (request: DecomposeLURequest): Promise<DecomposeLUResponse> => {
    const response = await api.post<DecomposeLUResponse>('/api/v1/decompose-lu', request);
    return response.data;
  },

  // Health check
  health: async (): Promise<any> => {
    const response = await api.get('/api/v1/health');
    return response.data;
  },

  // Simuler une machine de Turing
  turingSimulate: async (request: TuringMachineRequest): Promise<TuringMachineResponse> => {
    const response = await api.post<TuringMachineResponse>('/api/v1/turing/simulate', request);
    return response.data;
  },
};

export default api;
