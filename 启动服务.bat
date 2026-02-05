@echo off
chcp 65001 >nul
title 成长小英雄 - 本地服务

echo.
echo ======================================
echo    成长小英雄 - 本地服务启动
echo ======================================
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo [提示] 检测到依赖未安装，正在自动安装...
    echo.
    call npm install
    echo.
    echo [完成] 依赖安装完成！
    echo.
)

REM 检查端口是否被占用
echo [检查] 检查端口 3000 是否可用...
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo.
    echo [警告] 端口 3000 已被占用！
    echo 请检查是否已有服务在运行，或修改 vite.config.ts 中的端口号
    echo.
    pause
    exit /b 1
)

echo [启动] 正在启动开发服务器...
echo.
echo ======================================
echo  服务地址：http://localhost:3000
echo  按 Ctrl+C 可以停止服务
echo ======================================
echo.

call npm run dev

pause
