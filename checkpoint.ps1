# Atualiza o CHECKPOINT.md com uma nova etapa
# Uso: .\checkpoint.ps1 "descricao do que acabou de fazer"
# Uso: .\checkpoint.ps1 -Limpar  (marca sessao como encerrada)

param(
    [Parameter(Position=0)]
    [string]$Etapa,
    
    [switch]$Limpar
)

$arquivo = Join-Path $PSScriptRoot "CHECKPOINT.md"

if ($Limpar) {
    $conteudo = @"
# CHECKPOINT - Sessao em tempo real

> Atualizado **a cada passo** durante a sessao. Se cair/fechar, este arquivo diz exatamente onde paramos.

## Sessao encerrada

Nada em andamento. Proxima sessao comeca do zero.
"@
    [IO.File]::WriteAllText($arquivo, $conteudo, [Text.Encoding]::UTF8)
    Write-Host "Checkpoint limpo (sessao encerrada)" -ForegroundColor Green
    exit 0
}

if (-not $Etapa) {
    Write-Host "Uso: .\checkpoint.ps1 `"descricao da etapa`"" -ForegroundColor Yellow
    Write-Host "     .\checkpoint.ps1 -Limpar" -ForegroundColor Yellow
    exit 1
}

# Ler o arquivo atual
if (Test-Path $arquivo) {
    $linhas = [IO.File]::ReadAllLines($arquivo, [Text.Encoding]::UTF8)
} else {
    $linhas = @()
}

# Achar onde inserir a nova linha (depois da data/hora da sessao)
$hora = Get-Date -Format "HH:mm"
$novaLinha = "- $hora - $Etapa"

# Se o arquivo esta vazio ou e de sessao encerrada, criar nova sessao
if ($linhas.Count -eq 0 -or ($linhas -join "`n") -match "Sessao encerrada") {
    $data = Get-Date -Format "dd/MM/yyyy HH:mm"
    $conteudo = @"
# CHECKPOINT - Sessao em tempo real

> Atualizado **a cada passo** durante a sessao. Se cair/fechar, este arquivo diz exatamente onde paramos.

## Sessao atual: $data

$novaLinha
"@
} else {
    # Adicionar linha ao final (antes de qualquer linha em branco final)
    $ultimaLinhaUtil = $linhas.Count - 1
    while ($ultimaLinhaUtil -ge 0 -and [string]::IsNullOrWhiteSpace($linhas[$ultimaLinhaUtil])) {
        $ultimaLinhaUtil--
    }
    
    $novasLinhas = @()
    for ($i = 0; $i -le $ultimaLinhaUtil; $i++) {
        $novasLinhas += $linhas[$i]
    }
    $novasLinhas += $novaLinha
    
    $conteudo = $novasLinhas -join "`n"
}

# Gravar (UTF-8 sem BOM)
[IO.File]::WriteAllText($arquivo, $conteudo, [Text.Encoding]::UTF8)

Write-Host "Checkpoint atualizado: $Etapa" -ForegroundColor Cyan
