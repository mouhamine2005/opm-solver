from fastapi import APIRouter, HTTPException, status
from src.models import (
    SolveRequest, SolveResponse,
    DecomposeLURequest, DecomposeLUResponse,
    DeterminantRequest, DeterminantResponse,
    InverseRequest, InverseResponse,
    AnalysisRequest, AnalysisResponse,
    TuringMachineRequest, TuringMachineResponse, TuringExecutionStep
)
from src.services.matrix_solver import MatrixSolver
from src.services.turing_machine import TuringMachine
import numpy as np
import time

router = APIRouter(prefix="/api/v1", tags=["solver"])
solver = MatrixSolver()

def list_to_numpy(data):
    """Convertir liste en array NumPy"""
    return np.array(data, dtype=float)

def numpy_to_list(arr):
    """Convertir array NumPy en liste"""
    if arr.ndim == 1:
        return arr.tolist()
    elif arr.ndim == 2:
        return [row.tolist() for row in arr]
    return arr.tolist()

def calculate_residual(A, x, b):
    """Calculer l'erreur résiduelle ||Ax - b||"""
    return float(np.linalg.norm(A @ x - b))

@router.post("/solve", response_model=SolveResponse)
async def solve_linear_system(request: SolveRequest):
    """
    Résoudre un système linéaire Ax = b
    
    - **matrix_a**: Matrice de coefficients A (n×n)
    - **vector_b**: Vecteur résultat b (n,)
    - **method**: Méthode de résolution ('gauss', 'lu')
    """
    try:
        start_time = time.time()
        
        # Convertir en NumPy
        A = list_to_numpy(request.matrix_a.data)
        b = np.array(request.vector_b.data, dtype=float)
        
        # Résoudre selon la méthode
        if request.method == "gauss":
            x, info = solver.gauss_elimination(A, b)
        elif request.method == "lu":
            x, info = solver.solve_with_lu(A, b)
        else:
            raise ValueError(f"Méthode inconnue: {request.method}")
        
        # Calculer les métriques
        residual_error = calculate_residual(A, x, b)
        condition_number = float(np.linalg.cond(A))
        determinant = float(np.linalg.det(A))
        
        execution_time = time.time() - start_time
        
        return SolveResponse(
            success=True,
            solution=x.tolist(),
            residual_error=residual_error,
            method=request.method,
            execution_time=execution_time,
            matrix_condition=condition_number,
            determinant=determinant,
            message=f"Système résolu avec succès (méthode: {request.method})"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la résolution: {str(e)}"
        )

@router.post("/decompose-lu", response_model=DecomposeLUResponse)
async def decompose_lu(request: DecomposeLURequest):
    """Décomposition LU d'une matrice A = LU"""
    try:
        A = list_to_numpy(request.matrix_a.data)
        L, U, info = solver.lu_decomposition(A)
        
        return DecomposeLUResponse(
            success=True,
            matrix_l=numpy_to_list(L),
            matrix_u=numpy_to_list(U),
            execution_time=info['execution_time'],
            message="Décomposition LU réussie"
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/determinant", response_model=DeterminantResponse)
async def calculate_determinant(request: DeterminantRequest):
    """Calculer le déterminant d'une matrice"""
    try:
        A = list_to_numpy(request.matrix_a.data)
        det, info = solver.determinant(A)
        
        return DeterminantResponse(
            success=True,
            determinant=det,
            method=info['method'],
            execution_time=info['execution_time'],
            message=f"Déterminant calculé: {det:.6e}"
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/inverse", response_model=InverseResponse)
async def calculate_inverse(request: InverseRequest):
    """Calculer l'inverse d'une matrice"""
    try:
        A = list_to_numpy(request.matrix_a.data)
        A_inv, info = solver.inverse(A)
        
        return InverseResponse(
            success=True,
            matrix_inverse=numpy_to_list(A_inv),
            verification=info['verification_error'],
            execution_time=info['execution_time'],
            message="Matrice inverse calculée avec succès"
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_matrix(request: AnalysisRequest):
    """Analyse complète d'une matrice"""
    try:
        A = list_to_numpy(request.matrix_a.data)
        analysis = solver.analyze_matrix(A)
        
        return AnalysisResponse(
            success=True,
            determinant=analysis.get('determinant'),
            condition_number=analysis.get('condition_number'),
            is_singular=analysis.get('is_singular', False),
            is_symmetric=analysis.get('is_symmetric', False),
            is_positive_definite=analysis.get('is_positive_definite'),
            eigenvalues=analysis.get('eigenvalues'),
            rank=analysis.get('rank'),
            properties=analysis,
            recommendations=analysis.get('recommendations', []),
            execution_time=analysis['execution_time']
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/turing/simulate", response_model=TuringMachineResponse)
async def simulate_turing_machine(request: TuringMachineRequest):
    """
    Simuler l'exécution d'une machine de Turing
    
    - **initial_tape** ou **initial_tapes**: Contenu(s) initial(aux) du/des ruban(s)
    - **transitions**: Règles de transition de la machine
    - **final_states**: États acceptants
    - **max_steps**: Limite d'étapes (défaut: 1000, max: 100000)
    - **detect_loops**: Détecter les boucles infinies (défaut: true)
    
    Supporte:
    - Machines mono-ruban et multi-rubans (jusqu'à 10 rubans)
    - Détection automatique de boucles infinies
    - Animation frame-by-frame
    - Exécution jusqu'à 100000 étapes
    """
    try:
        # Déterminer le nombre de rubans
        if request.initial_tapes is not None:
            # Multi-rubans
            tapes = request.initial_tapes
            num_tapes = len(tapes)
            head_positions = request.head_positions if request.head_positions else [0] * num_tapes
        else:
            # Mono-ruban
            tapes = [request.initial_tape or ""]
            num_tapes = 1
            head_positions = [request.head_position]
        
        # Convertir les transitions au format attendu
        transitions = []
        for trans in request.transitions:
            trans_dict = {
                'current_state': trans.current_state,
                'next_state': trans.next_state
            }
            
            if num_tapes == 1:
                # Mono-ruban
                trans_dict['read_symbol'] = trans.read_symbol
                trans_dict['write_symbol'] = trans.write_symbol
                trans_dict['move_direction'] = trans.move_direction
            else:
                # Multi-rubans
                trans_dict['read_symbols'] = trans.read_symbols
                trans_dict['write_symbols'] = trans.write_symbols
                trans_dict['move_directions'] = trans.move_directions
            
            transitions.append(trans_dict)
        
        # Créer et exécuter la machine de Turing
        tm = TuringMachine(
            tapes=tapes,
            blank_symbol=request.blank_symbol,
            initial_state=request.initial_state,
            final_states=request.final_states,
            transitions=transitions,
            head_positions=head_positions,
            detect_loops=request.detect_loops
        )
        
        # Exécuter avec données d'animation
        result = tm.run_with_animation_data(max_steps=request.max_steps)
        
        # Convertir les étapes au format Pydantic
        execution_steps = [
            TuringExecutionStep(
                step_number=step['step_number'],
                current_state=step['current_state'],
                tape_contents=step['tape_contents'],
                head_positions=step['head_positions'],
                symbols_read=step['symbols_read'],
                action_taken=step.get('action_taken')
            )
            for step in result['execution_steps']
        ]
        
        return TuringMachineResponse(
            success=result['success'],
            accepted=result.get('accepted'),
            final_tapes=result.get('final_tapes'),
            final_state=result.get('final_state'),
            execution_steps=execution_steps,
            total_steps=result['total_steps'],
            halted=result['halted'],
            halt_reason=result.get('halt_reason'),
            loop_detected=result.get('loop_detected', False),
            execution_time=result['execution_time'],
            message=result.get('message'),
            num_tapes=result['num_tapes'],
            animation_frames=result.get('animation_frames')
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur de validation: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la simulation: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Vérifier que l'API fonctionne"""
    return {
        "status": "healthy",
        "message": "OPM Solver Pro API is running",
        "version": "1.0.0",
        "features": ["linear_solver", "matrix_analysis", "turing_machine"]
    }
