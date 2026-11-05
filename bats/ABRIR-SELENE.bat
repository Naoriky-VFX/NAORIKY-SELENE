@echo off
title AGENT SELENE - NAORIKY-SELENE
cd /d "%~dp0.."

echo.
echo   [SELENE] atualizando a etiqueta do agente...
python "%~dp0atualizar-agente.py"
echo.

set "SESSAO="
if exist "%~dp0.sessao" set /p SESSAO=<"%~dp0.sessao"

if "%SESSAO%"=="" (
  echo   [SELENE] sem sessao registrada - retomando a ultima conversa desta pasta
  selene --continue
) else (
  echo   [SELENE] retomando a sessao %SESSAO%
  selene --session %SESSAO%
)

if errorlevel 1 (
  echo.
  echo   [SELENE] o comando "selene" falhou.
  echo   Confira se ele esta no PATH (terminal novo e teste: selene --version)
  echo.
  pause
)
