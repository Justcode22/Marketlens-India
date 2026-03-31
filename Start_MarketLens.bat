@echo off
echo ===================================================
echo     Starting MarketLens India Application
echo     Please keep the two new black windows open
echo ===================================================

echo.
echo [1/2] Starting Data API (Backend) in a new window...
start "MarketLens API" cmd /k "cd backend && echo Setting up Python Environment... && python -m venv venv && call venv\Scripts\activate.bat && echo Installing Python Packages... && pip install fastapi uvicorn yfinance pandas requests && echo Starting API Server... && python -m uvicorn app.main:app --host localhost --port 8000"

echo [2/2] Starting Dashboard (Frontend) in a new window...
start "MarketLens Dashboard" cmd /k "cd frontend && echo Installing Node Packages... && npm install && echo Starting Next.js Server... && npm run dev"

echo.
echo ===================================================
echo     Waiting 15 seconds for servers to boot up...
echo     Your browser will open automatically!
echo ===================================================
timeout /t 15 /nobreak > NUL

start http://localhost:3000

echo.
echo You can now use the dashboard in your browser!
echo When you are done, simply close the two new black terminal windows to stop the servers.
pause
