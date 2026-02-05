@echo off
title Growth Little Hero

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo Starting web server...
start cmd /c "npm run dev"

ping 127.0.0.1 -n 6 > nul

echo Starting desktop application...
start npm run electron:dev

ping 127.0.0.1 -n 3 > nul

echo.
echo ==========================================
echo    App Started Successfully!
echo ==========================================
echo.
pause
