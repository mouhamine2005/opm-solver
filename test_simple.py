import requests
import traceback

try:
    print("Testing health endpoint...")
    response = requests.get("http://localhost:8000/api/v1/health", timeout=5)
    print(f"Health check: {response.status_code}")
    print(response.json())
    print()
    
    print("Testing solve endpoint...")
    data = {
        "matrix_a": {"data": [[7.1, 6.9], [-1.7, 5.4]]},
        "vector_b": {"data": [5.0, 8.0]},
        "method": "gauss"
    }
    print(f"Sending data: {data}")
    response = requests.post("http://localhost:8000/api/v1/solve", json=data, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
