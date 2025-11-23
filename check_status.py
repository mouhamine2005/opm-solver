"""
Vérification de l'état des serveurs OPM Solver Pro
"""
import requests
import sys
from datetime import datetime

def check_backend():
    """Vérifie l'état du backend"""
    try:
        response = requests.get("http://localhost:8000/api/v1/health", timeout=2)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend (FastAPI):")
            print(f"   Status: {data['status']}")
            print(f"   Message: {data['message']}")
            print(f"   Version: {data['version']}")
            print(f"   URL: http://localhost:8000")
            print(f"   Docs: http://localhost:8000/docs")
            return True
        else:
            print(f"❌ Backend: Status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend: Impossible de se connecter (port 8000)")
        print("   Le serveur n'est peut-être pas démarré.")
        print("   Lancez: start_backend.bat")
        return False
    except Exception as e:
        print(f"❌ Backend: Erreur - {e}")
        return False

def check_frontend():
    """Vérifie l'état du frontend"""
    try:
        response = requests.get("http://localhost:3000", timeout=2)
        if response.status_code == 200:
            print("\n✅ Frontend (Next.js):")
            print(f"   Status: Opérationnel")
            print(f"   URL: http://localhost:3000")
            print(f"   Solver: http://localhost:3000/solver")
            return True
        else:
            print(f"\n❌ Frontend: Status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("\n❌ Frontend: Impossible de se connecter (port 3000)")
        print("   Le serveur n'est peut-être pas démarré.")
        print("   Lancez: start_frontend.bat")
        return False
    except Exception as e:
        print(f"\n❌ Frontend: Erreur - {e}")
        return False

def test_solve_endpoint():
    """Test rapide de l'endpoint solve"""
    try:
        data = {
            "matrix_a": {"data": [[2, 1], [1, 3]]},
            "vector_b": {"data": [5, 5]},
            "method": "gauss"
        }
        response = requests.post(
            "http://localhost:8000/api/v1/solve",
            json=data,
            timeout=5
        )
        if response.status_code == 200:
            result = response.json()
            print("\n✅ Test API /solve:")
            print(f"   Système 2×2 résolu avec succès")
            print(f"   Solution: {result['solution']}")
            print(f"   Erreur résiduelle: {result['residual_error']}")
            print(f"   Temps: {result['execution_time']*1000:.2f}ms")
            return True
        else:
            print(f"\n❌ Test API /solve: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"\n❌ Test API /solve: Erreur - {e}")
        return False

def main():
    print("=" * 60)
    print(" OPM Solver Pro - Vérification de l'État des Serveurs")
    print("=" * 60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    backend_ok = check_backend()
    frontend_ok = check_frontend()
    
    if backend_ok and frontend_ok:
        api_ok = test_solve_endpoint()
        
        print("\n" + "=" * 60)
        print(" RÉSUMÉ")
        print("=" * 60)
        print(f"Backend:  {'✅ Opérationnel' if backend_ok else '❌ Hors ligne'}")
        print(f"Frontend: {'✅ Opérationnel' if frontend_ok else '❌ Hors ligne'}")
        print(f"API Test: {'✅ Succès' if api_ok else '❌ Échec'}")
        print("=" * 60)
        
        if backend_ok and frontend_ok and api_ok:
            print("\n🎉 Tous les systèmes sont opérationnels!")
            print("\n📌 Accès rapide:")
            print("   • Interface Web: http://localhost:3000")
            print("   • Solver: http://localhost:3000/solver")
            print("   • API Docs: http://localhost:8000/docs")
            sys.exit(0)
        else:
            print("\n⚠️  Certains tests ont échoué.")
            sys.exit(1)
    else:
        print("\n" + "=" * 60)
        print(" RÉSUMÉ")
        print("=" * 60)
        print(f"Backend:  {'✅ Opérationnel' if backend_ok else '❌ Hors ligne'}")
        print(f"Frontend: {'✅ Opérationnel' if frontend_ok else '❌ Hors ligne'}")
        print("=" * 60)
        
        print("\n⚠️  Un ou plusieurs serveurs ne répondent pas.")
        print("\n📋 Pour démarrer les serveurs:")
        print("   • Tous les serveurs: Double-cliquez sur START.bat")
        print("   • Backend seul: Double-cliquez sur start_backend.bat")
        print("   • Frontend seul: Double-cliquez sur start_frontend.bat")
        sys.exit(1)

if __name__ == "__main__":
    main()
