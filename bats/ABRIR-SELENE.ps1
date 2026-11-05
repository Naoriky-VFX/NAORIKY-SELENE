# Abre a SELENE nesta pasta, retomando a sessao mais recente.
#
#   powershell -ExecutionPolicy Bypass -File bats\ABRIR-SELENE.ps1
#   powershell -ExecutionPolicy Bypass -File bats\ABRIR-SELENE.ps1 -SoAtualizar
#
# -SoAtualizar  so atualiza a etiqueta (sessao + data), sem abrir a SELENE.

param([switch]$SoAtualizar)

$ErrorActionPreference = "Stop"
$pastaBat = $PSScriptRoot
$raiz = Split-Path -Parent $pastaBat
Set-Location $raiz

Write-Host "[SELENE] atualizando a etiqueta do agente..." -ForegroundColor Cyan
python (Join-Path $pastaBat "atualizar-agente.py")

if ($SoAtualizar) {
    Write-Host "[SELENE] etiqueta atualizada (a SELENE nao foi aberta)." -ForegroundColor DarkGray
    exit 0
}

$arqSessao = Join-Path $pastaBat ".sessao"
$sessao = ""
if (Test-Path $arqSessao) {
    $sessao = (Get-Content $arqSessao -Raw).Trim()
}

if (-not (Get-Command selene -ErrorAction SilentlyContinue)) {
    Write-Host "[SELENE] erro: o comando 'selene' nao esta no PATH." -ForegroundColor Red
    Write-Host "         instale/reinstale e abra um terminal novo." -ForegroundColor DarkGray
    exit 1
}

if ($sessao) {
    Write-Host "[SELENE] retomando a sessao $sessao" -ForegroundColor Green
    & selene --session $sessao
} else {
    Write-Host "[SELENE] sem sessao registrada - retomando a ultima conversa desta pasta" -ForegroundColor Yellow
    & selene --continue
}
