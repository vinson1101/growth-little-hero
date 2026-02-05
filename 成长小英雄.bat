@echo off
chcp 65001 >nul
title 成长小英雄

REM 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo 正在安装依赖，请稍候...
    call npm install >nul 2>&1
)

REM 启动Vite开发服务器（后台）
start /B cmd /c "npm run dev >nul 2>&1"

REM 等待服务器启动
timeout /t 5 /nobreak >nul

REM 启动Electron桌面应用
start npm run electron:dev

REM 等待一下确保应用启动
timeout /t 2 /nobreak >nul

echo.
echo ==========================================
echo    成长小英雄已启动！
echo ==========================================
echo.
echo 应用正在独立窗口中运行
echo 关闭此窗口不会关闭应用
echo.
pause
