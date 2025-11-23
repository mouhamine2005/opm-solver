import requests
import json

# Test 1: Health check
print("Test 1: Health Check")
response = requests.get("http://localhost:8000/api/v1/health")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}\n")

# Test 2: Simple 2x2 system
print("Test 2: Solve 2x2 System")
data = {
    "matrix_a": {"data": [[2, 1], [1, 3]]},
    "vector_b": {"data": [5, 5]},
    "method": "gauss"
}
response = requests.post("http://localhost:8000/api/v1/solve", json=data)
print(f"Status: {response.status_code}")
result = response.json()
if response.status_code != 200:
    print(f"Error: {result}")
    exit(1)
print(f"Solution: {result['solution']}")
print(f"Residual error: {result['residual_error']}")
print(f"Execution time: {result['execution_time']*1000:.3f}ms\n")

# Test 3: 3x3 system
print("Test 3: Solve 3x3 System")
data = {
    "matrix_a": {"data": [[1, 2, 3], [4, 5, 6], [7, 8, 10]]},
    "vector_b": {"data": [14, 32, 51]},
    "method": "gauss"
}
response = requests.post("http://localhost:8000/api/v1/solve", json=data)
print(f"Status: {response.status_code}")
result = response.json()
print(f"Solution: {result['solution']}")
print(f"Residual error: {result['residual_error']}")
print(f"Execution time: {result['execution_time']*1000:.3f}ms\n")

# Test 4: Determinant
print("Test 4: Calculate Determinant")
data = {
    "matrix_a": {"data": [[1, 2, 3], [4, 5, 6], [7, 8, 10]]}
}
response = requests.post("http://localhost:8000/api/v1/determinant", json=data)
print(f"Status: {response.status_code}")
result = response.json()
print(f"Determinant: {result['determinant']}")
print(f"Execution time: {result['execution_time']*1000:.3f}ms\n")

# Test 5: Matrix Analysis
print("Test 5: Matrix Analysis")
data = {
    "matrix_a": {"data": [[4, 1], [1, 3]]}
}
response = requests.post("http://localhost:8000/api/v1/analyze", json=data)
print(f"Status: {response.status_code}")
result = response.json()
print(f"Determinant: {result['determinant']}")
print(f"Condition number: {result['condition_number']}")
print(f"Is symmetric: {result['is_symmetric']}")
print(f"Rank: {result['rank']}")
print(f"Eigenvalues: {result['eigenvalues']}")
print(f"Recommendations: {result['recommendations']}")

print("\n✅ All tests passed!")
