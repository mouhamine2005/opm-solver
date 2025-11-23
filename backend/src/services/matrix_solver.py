import numpy as np
from typing import Tuple, Optional, Dict, Any
import time

class MatrixSolver:
    """Classe principale pour résoudre les systèmes linéaires"""
    
    def __init__(self, tolerance: float = 1e-10):
        self.tolerance = tolerance
    
    def gauss_elimination(self, A: np.ndarray, b: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Résoudre Ax = b par élimination gaussienne avec pivotage partiel
        
        Returns:
            solution: vecteur x
            info: dictionnaire avec informations supplémentaires
        """
        start_time = time.time()
        
        n = len(b)
        A = A.copy().astype(float)
        b = b.copy().astype(float)
        
        # Matrice augmentée
        M = np.hstack([A, b.reshape(-1, 1)])
        
        # Phase 1: Élimination avant
        for i in range(n):
            # Pivotage partiel
            max_row = i + np.argmax(np.abs(M[i:, i]))
            
            if max_row != i:
                M[[i, max_row]] = M[[max_row, i]]
            
            # Vérifier le pivot
            if np.abs(M[i, i]) < self.tolerance:
                raise ValueError(f"Matrice singulière détectée (pivot {i+1} ≈ 0)")
            
            # Élimination
            for k in range(i + 1, n):
                factor = M[k, i] / M[i, i]
                M[k, i:] -= factor * M[i, i:]
        
        # Phase 2: Substitution arrière
        x = np.zeros(n)
        for i in range(n - 1, -1, -1):
            x[i] = M[i, -1]
            for j in range(i + 1, n):
                x[i] -= M[i, j] * x[j]
            x[i] /= M[i, i]
        
        execution_time = time.time() - start_time
        
        info = {
            'execution_time': execution_time,
            'method': 'gauss_elimination'
        }
        
        return x, info
    
    def lu_decomposition(self, A: np.ndarray) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        Décomposition LU de A = LU
        
        Returns:
            L: matrice triangulaire inférieure
            U: matrice triangulaire supérieure
            info: informations supplémentaires
        """
        start_time = time.time()
        
        n = A.shape[0]
        L = np.eye(n)
        U = A.copy().astype(float)
        
        for i in range(n):
            for k in range(i + 1, n):
                if np.abs(U[i, i]) < self.tolerance:
                    raise ValueError(f"Impossible de décomposer: pivot {i+1} ≈ 0")
                
                factor = U[k, i] / U[i, i]
                L[k, i] = factor
                U[k, i:] -= factor * U[i, i:]
        
        execution_time = time.time() - start_time
        
        info = {
            'execution_time': execution_time,
            'method': 'lu_decomposition'
        }
        
        return L, U, info
    
    def solve_with_lu(self, A: np.ndarray, b: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """Résoudre Ax = b en utilisant la décomposition LU"""
        start_time = time.time()
        
        L, U, lu_info = self.lu_decomposition(A)
        
        # Résoudre Ly = b (forward substitution)
        n = len(b)
        y = np.zeros(n)
        for i in range(n):
            y[i] = b[i]
            for j in range(i):
                y[i] -= L[i, j] * y[j]
            y[i] /= L[i, i]
        
        # Résoudre Ux = y (backward substitution)
        x = np.zeros(n)
        for i in range(n - 1, -1, -1):
            x[i] = y[i]
            for j in range(i + 1, n):
                x[i] -= U[i, j] * x[j]
            x[i] /= U[i, i]
        
        execution_time = time.time() - start_time
        
        info = {
            'L': L,
            'U': U,
            'execution_time': execution_time,
            'method': 'lu_solver'
        }
        
        return x, info
    
    def determinant(self, A: np.ndarray) -> Tuple[float, Dict[str, Any]]:
        """Calculer le déterminant via décomposition LU"""
        start_time = time.time()
        
        L, U, lu_info = self.lu_decomposition(A)
        
        # det(A) = det(L) × det(U) = 1 × prod(diag(U))
        det = np.prod(np.diag(U))
        
        execution_time = time.time() - start_time
        
        info = {
            'execution_time': execution_time,
            'method': 'lu_determinant'
        }
        
        return float(det), info
    
    def inverse(self, A: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """Calculer l'inverse de A en résolvant n systèmes"""
        start_time = time.time()
        
        n = A.shape[0]
        A_inv = np.zeros_like(A, dtype=float)
        
        for i in range(n):
            e_i = np.zeros(n)
            e_i[i] = 1.0
            A_inv[:, i], _ = self.gauss_elimination(A, e_i)
        
        # Vérification
        identity_check = np.linalg.norm(A @ A_inv - np.eye(n))
        
        execution_time = time.time() - start_time
        
        info = {
            'execution_time': execution_time,
            'verification_error': float(identity_check),
            'method': 'inverse_gauss'
        }
        
        return A_inv, info
    
    def analyze_matrix(self, A: np.ndarray) -> Dict[str, Any]:
        """Analyse complète d'une matrice"""
        start_time = time.time()
        
        analysis = {
            'shape': A.shape,
            'is_square': A.shape[0] == A.shape[1],
        }
        
        if not analysis['is_square']:
            analysis['execution_time'] = time.time() - start_time
            return analysis
        
        # Déterminant
        try:
            det, _ = self.determinant(A)
            analysis['determinant'] = det
            analysis['is_singular'] = abs(det) < self.tolerance
        except Exception as e:
            analysis['determinant'] = None
            analysis['is_singular'] = True
        
        # Nombre de conditionnement
        try:
            analysis['condition_number'] = float(np.linalg.cond(A))
        except:
            analysis['condition_number'] = None
        
        # Symétrie
        analysis['is_symmetric'] = np.allclose(A, A.T, atol=self.tolerance)
        
        # Définie positive (si symétrique)
        if analysis['is_symmetric']:
            try:
                np.linalg.cholesky(A)
                analysis['is_positive_definite'] = True
            except:
                analysis['is_positive_definite'] = False
        
        # Valeurs propres
        try:
            eigenvalues = np.linalg.eigvals(A)
            analysis['eigenvalues'] = eigenvalues.real.tolist()
        except:
            analysis['eigenvalues'] = None
        
        # Rang
        try:
            analysis['rank'] = int(np.linalg.matrix_rank(A))
        except:
            analysis['rank'] = None
        
        # Recommandations
        recommendations = []
        
        if analysis.get('condition_number', 0) > 1e6:
            recommendations.append("⚠️ Matrice mal conditionnée")
        elif analysis.get('condition_number', 0) > 100:
            recommendations.append("⚠️ Matrice moyennement conditionnée")
        else:
            recommendations.append("✓ Matrice bien conditionnée")
        
        if analysis.get('is_singular'):
            recommendations.append("❌ Matrice singulière")
        else:
            recommendations.append("✓ Matrice inversible")
        
        if analysis.get('is_symmetric'):
            recommendations.append("✓ Matrice symétrique")
        
        if analysis.get('is_positive_definite'):
            recommendations.append("✓ Matrice définie positive")
        
        analysis['recommendations'] = recommendations
        analysis['execution_time'] = time.time() - start_time
        
        return analysis
