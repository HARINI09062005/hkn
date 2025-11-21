@echo off
setlocal enabledelayedexpansion

echo Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found in PATH. Checking standard locations...
    if exist "C:\Program Files\nodejs\node.exe" (
        echo Found Node.js at C:\Program Files\nodejs
        set "PATH=%PATH%;C:\Program Files\nodejs"
    ) else (
        echo Error: Node.js is not installed.
        echo Please install Node.js LTS from https://nodejs.org/
        pause
        exit /b
    )
)

echo Node.js is ready.
echo.
echo Navigating to client directory...
cd client

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed.
)

echo.
echo Starting the application...
echo The application will open in your default browser at http://localhost:5173
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
pause
