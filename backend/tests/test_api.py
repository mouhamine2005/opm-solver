import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_health_check():
    """Test endpoint health"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_solve_simple_system():
    """Test résolution système simple"""
    request_data = {
        "matrix_a": {
            "data": [[3, 2], [2, 4]]
        },
        "vector_b": {
            "data": [5, 8]
        },
        "method": "gauss"
    }
    
    response = client.post("/api/v1/solve", json=request_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["success"] is True
    assert "solution" in data
    assert len(data["solution"]) == 2
    assert data["residual_error"] < 1e-10

def test_solve_3x3_system():
    """Test résolution système 3×3"""
    request_data = {
        "matrix_a": {
            "data": [
                [3, 2, -1],
                [2, -2, 4],
                [-1, 0.5, -1]
            ]
        },
        "vector_b": {
            "data": [1, -2, 0]
        },
        "method": "gauss"
    }
    
    response = client.post("/api/v1/solve", json=request_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["success"] is True
    assert len(data["solution"]) == 3

def test_decompose_lu():
    """Test décomposition LU"""
    request_data = {
        "matrix_a": {
            "data": [[4, 3], [6, 3]]
        }
    }
    
    response = client.post("/api/v1/decompose-lu", json=request_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["success"] is True
    assert "matrix_l" in data
    assert "matrix_u" in data

def test_calculate_determinant():
    """Test calcul déterminant"""
    request_data = {
        "matrix_a": {
            "data": [[1, 2], [3, 4]]
        }
    }
    
    response = client.post("/api/v1/determinant", json=request_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["success"] is True
    assert abs(data["determinant"] - (-2.0)) < 1e-10

def test_analyze_matrix():
    """Test analyse complète"""
    request_data = {
        "matrix_a": {
            "data": [[4, 1], [1, 3]]
        }
    }
    
    response = client.post("/api/v1/analyze", json=request_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["success"] is True
    assert data["is_symmetric"] is True
    assert data["is_singular"] is False
    assert "recommendations" in data
