@echo off
echo Starting Vastrashahi Admin Panel...
echo.
echo IMPORTANT: Make sure your backend server is running on port 8000
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Starting development server on port 5000...
call npm run dev -- -p 5000 