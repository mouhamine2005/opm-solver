@echo off
echo ========================================
echo    OPM Solver Pro - Demarrage Backend
echo ========================================
echo.

cd /d "%~dp0backend"

if not exist "venv\Scripts\activate.bat" (
    echo [ERREUR] Environnement virtuel non trouve!
    echo Veuillez d'abord installer les dependances:
    echo   python -m venv venv
    echo   .\venv\Scripts\activate
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)

echo Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo.
echo Demarrage du serveur FastAPI sur http://localhost:8000...
echo Documentation API: http://localhost:8000/docs
echo Health Check: http://localhost:8000/api/v1/health
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

uvicorn src.app:app --reload --port 8000
