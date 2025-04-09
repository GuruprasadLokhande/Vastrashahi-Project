@echo off
echo Starting the Vastrashahi Development Environment...
echo.
echo ===============================================
echo Step 1: Starting the Backend Server (Port 8000)
echo ===============================================
echo.
echo IMPORTANT: Make sure MongoDB is running!
echo.
start cmd /k "cd ../backend && npm run start-dev"

echo.
echo ===============================================
echo Step 2: Starting the Admin Panel (Port 5000)
echo ===============================================
echo.
echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak > nul

start cmd /k "cd .. && cd admin-panel && npm run dev -- -p 5000"

echo.
echo ===============================================
echo Development environment is starting up!
echo.
echo Backend:    http://localhost:8000
echo Admin Panel: http://localhost:5000
echo ===============================================
echo. 