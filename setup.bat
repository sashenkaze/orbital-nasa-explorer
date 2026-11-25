@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo   ORBITAL - NASA Media Explorer
 echo ==========================================
node -v >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 20.19 or newer first.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed. Check your internet connection.
    pause
    exit /b 1
  )
)
echo Starting the development server...
call npm run dev
