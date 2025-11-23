from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from datetime import datetime

class MatrixInput(BaseModel):
    """Modèle pour l'entrée d'une matrice"""
    data: List[List[float]] = Field(..., description="Matrice 2D")
    
    @validator('data')
    def validate_matrix(cls, v):
        if not v:
            raise ValueError("La matrice ne peut pas être vide")
        
        rows = len(v)
        cols = len(v[0]) if v else 0
        
        if rows == 0 or cols == 0:
            raise ValueError("La matrice doit avoir au moins 1 ligne et 1 colonne")
        
        if not all(len(row) == cols for row in v):
            raise ValueError("Toutes les lignes doivent avoir la même longueur")
        
        return v

class VectorInput(BaseModel):
    """Modèle pour l'entrée d'un vecteur"""
    data: List[float] = Field(..., description="Vecteur 1D")
    
    @validator('data')
    def validate_vector(cls, v):
        if not v:
            raise ValueError("Le vecteur ne peut pas être vide")
        return v

class SolveRequest(BaseModel):
    """Requête pour résoudre un système Ax = b"""
    matrix_a: MatrixInput = Field(..., description="Matrice A (n×n)")
    vector_b: VectorInput = Field(..., description="Vecteur b (n,)")
    method: Literal["gauss", "lu"] = Field(
        default="gauss",
        description="Méthode de résolution"
    )
    
    @validator('vector_b')
    def validate_dimensions(cls, v, values):
        if 'matrix_a' in values:
            matrix_a = values['matrix_a']
            n_rows = len(matrix_a.data)
            n_cols = len(matrix_a.data[0]) if matrix_a.data else 0
            
            if n_rows != n_cols:
                raise ValueError(f"La matrice A doit être carrée (actuellement {n_rows}×{n_cols})")
            
            if len(v.data) != n_rows:
                raise ValueError(
                    f"Le vecteur b doit avoir {n_rows} éléments (actuellement {len(v.data)})"
                )
        
        return v

class SolveResponse(BaseModel):
    """Réponse pour la résolution d'un système"""
    success: bool = Field(..., description="Succès de l'opération")
    solution: Optional[List[float]] = Field(None, description="Vecteur solution x")
    residual_error: Optional[float] = Field(None, description="Erreur résiduelle ||Ax - b||")
    method: str = Field(..., description="Méthode utilisée")
    execution_time: float = Field(..., description="Temps d'exécution (secondes)")
    matrix_condition: Optional[float] = Field(None, description="Nombre de conditionnement")
    determinant: Optional[float] = Field(None, description="Déterminant de A")
    message: Optional[str] = Field(None, description="Message d'information")

class DecomposeLURequest(BaseModel):
    """Requête pour décomposition LU"""
    matrix_a: MatrixInput = Field(..., description="Matrice A à décomposer")

class DecomposeLUResponse(BaseModel):
    """Réponse pour décomposition LU"""
    success: bool
    matrix_l: Optional[List[List[float]]] = Field(None, description="Matrice L")
    matrix_u: Optional[List[List[float]]] = Field(None, description="Matrice U")
    execution_time: float
    message: Optional[str] = None

class DeterminantRequest(BaseModel):
    """Requête pour calcul du déterminant"""
    matrix_a: MatrixInput = Field(..., description="Matrice A")

class DeterminantResponse(BaseModel):
    """Réponse pour calcul du déterminant"""
    success: bool
    determinant: Optional[float] = None
    method: str = "lu_decomposition"
    execution_time: float
    message: Optional[str] = None

class InverseRequest(BaseModel):
    """Requête pour calcul de l'inverse"""
    matrix_a: MatrixInput = Field(..., description="Matrice A")

class InverseResponse(BaseModel):
    """Réponse pour calcul de l'inverse"""
    success: bool
    matrix_inverse: Optional[List[List[float]]] = Field(None, description="Matrice A⁻¹")
    verification: Optional[float] = Field(None, description="||A·A⁻¹ - I||")
    execution_time: float
    message: Optional[str] = None

class AnalysisRequest(BaseModel):
    """Requête pour analyse complète"""
    matrix_a: MatrixInput
    vector_b: Optional[VectorInput] = None

class AnalysisResponse(BaseModel):
    """Réponse pour analyse complète"""
    success: bool
    determinant: Optional[float] = None
    condition_number: Optional[float] = None
    is_singular: bool
    is_symmetric: bool
    is_positive_definite: Optional[bool] = None
    eigenvalues: Optional[List[float]] = None
    rank: Optional[int] = None
    properties: dict = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)
    execution_time: float


# ============================================================================
# TURING MACHINE MODELS
# ============================================================================

class TuringTransition(BaseModel):
    """
    Règle de transition pour machine de Turing
    Supporte mono-ruban et multi-rubans
    """
    current_state: str = Field(..., description="État actuel", min_length=1)
    read_symbol: Optional[str] = Field(None, description="Symbole lu (mono-ruban)", min_length=1, max_length=1)
    read_symbols: Optional[List[str]] = Field(None, description="Symboles lus (multi-rubans)")
    next_state: str = Field(..., description="État suivant", min_length=1)
    write_symbol: Optional[str] = Field(None, description="Symbole à écrire (mono-ruban)", min_length=1, max_length=1)
    write_symbols: Optional[List[str]] = Field(None, description="Symboles à écrire (multi-rubans)")
    move_direction: Optional[Literal["L", "R", "N"]] = Field(None, description="Direction (L=gauche, R=droite, N=aucun)")
    move_directions: Optional[List[Literal["L", "R", "N"]]] = Field(None, description="Directions (multi-rubans)")
    
    @validator('read_symbols')
    def validate_read_symbols(cls, v, values):
        if v is not None:
            if not v:
                raise ValueError("read_symbols ne peut pas être vide si spécifié")
            if any(len(s) != 1 for s in v):
                raise ValueError("Chaque symbole doit être un seul caractère")
        return v
    
    @validator('write_symbols')
    def validate_write_symbols(cls, v, values):
        if v is not None:
            if not v:
                raise ValueError("write_symbols ne peut pas être vide si spécifié")
            if any(len(s) != 1 for s in v):
                raise ValueError("Chaque symbole doit être un seul caractère")
            if 'read_symbols' in values and values['read_symbols']:
                if len(v) != len(values['read_symbols']):
                    raise ValueError("write_symbols et read_symbols doivent avoir la même longueur")
        return v
    
    @validator('move_directions')
    def validate_move_directions(cls, v, values):
        if v is not None:
            if not v:
                raise ValueError("move_directions ne peut pas être vide si spécifié")
            if 'read_symbols' in values and values['read_symbols']:
                if len(v) != len(values['read_symbols']):
                    raise ValueError("move_directions et read_symbols doivent avoir la même longueur")
        return v


class TuringMachineRequest(BaseModel):
    """Requête pour simuler une machine de Turing"""
    # Rubans
    initial_tape: Optional[str] = Field(None, description="Contenu initial du ruban (mono-ruban)")
    initial_tapes: Optional[List[str]] = Field(None, description="Contenus initiaux des rubans (multi-rubans)")
    
    # Configuration
    blank_symbol: str = Field(default="_", description="Symbole blanc", min_length=1, max_length=1)
    initial_state: str = Field(default="q0", description="État initial", min_length=1)
    final_states: List[str] = Field(..., description="États acceptants", min_items=1)
    transitions: List[TuringTransition] = Field(..., description="Règles de transition", min_items=1)
    
    # Paramètres d'exécution
    max_steps: int = Field(default=10000, ge=1, le=1000000, description="Nombre maximum d'étapes")
    head_position: Optional[int] = Field(default=0, ge=0, description="Position initiale de la tête (mono-ruban)")
    head_positions: Optional[List[int]] = Field(None, description="Positions initiales des têtes (multi-rubans)")
    detect_loops: bool = Field(default=True, description="Activer la détection de boucles infinies")
    
    @validator('initial_tapes')
    def validate_tapes(cls, v, values):
        # Au moins un ruban doit être spécifié
        if v is None and 'initial_tape' not in values:
            raise ValueError("Au moins un ruban doit être spécifié (initial_tape ou initial_tapes)")
        
        if v is not None:
            if not v:
                raise ValueError("initial_tapes ne peut pas être une liste vide")
            if len(v) > 10:
                raise ValueError("Maximum 10 rubans supportés")
        
        return v
    
    @validator('head_positions')
    def validate_head_positions(cls, v, values):
        if v is not None:
            if 'initial_tapes' in values and values['initial_tapes']:
                if len(v) != len(values['initial_tapes']):
                    raise ValueError("head_positions doit avoir la même longueur que initial_tapes")
            if any(pos < 0 for pos in v):
                raise ValueError("Les positions des têtes doivent être >= 0")
        return v


class TuringExecutionStep(BaseModel):
    """Une étape d'exécution de la machine de Turing"""
    step_number: int = Field(..., description="Numéro de l'étape")
    current_state: str = Field(..., description="État actuel")
    tape_contents: List[str] = Field(..., description="Contenus des rubans")
    head_positions: List[int] = Field(..., description="Positions des têtes")
    symbols_read: List[str] = Field(..., description="Symboles lus")
    action_taken: Optional[str] = Field(None, description="Action effectuée")


class TuringMachineResponse(BaseModel):
    """Réponse de la simulation de machine de Turing"""
    success: bool = Field(..., description="Succès de l'opération")
    accepted: Optional[bool] = Field(None, description="Entrée acceptée?")
    final_tapes: Optional[List[str]] = Field(None, description="Contenus finaux des rubans")
    final_state: Optional[str] = Field(None, description="État final atteint")
    execution_steps: List[TuringExecutionStep] = Field(default_factory=list, description="Historique des étapes")
    total_steps: int = Field(0, description="Nombre total d'étapes")
    halted: bool = Field(False, description="Machine arrêtée?")
    halt_reason: Optional[str] = Field(None, description="Raison de l'arrêt")
    loop_detected: bool = Field(False, description="Boucle infinie détectée?")
    execution_time: float = Field(..., description="Temps d'exécution (secondes)")
    message: Optional[str] = Field(None, description="Message descriptif")
    num_tapes: int = Field(1, description="Nombre de rubans utilisés")
    animation_frames: Optional[List[dict]] = Field(None, description="Données pour animation")
