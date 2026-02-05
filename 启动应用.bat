@echo off
title Growth Little Hero

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo Starting web server in background...
start /B cmd /c "npm run dev > nul 2>&1"

ping 127.0.0.1 -n 6 > nul

echo Starting application...
start chrome --app=http://localhost:3000

ping 127.0.0.1 -n 3 > nul

echo.
echo ==========================================
echo    App Started Successfully!
echo ==========================================
echo.
echo Application is running in Chrome window
echo Close this window to stop the server
echo.
pause
taskkill /F /IM node.exe > nul 2>&1
