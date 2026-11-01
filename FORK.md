# SELENE

Terminal AI coding agent — fork rebrandeado do **OpenCode**.

> **Nome do produto: SELENE** (deusa grega da Lua).
> `NAORIKY-SELENE` é apenas o nome do repositório/pasta no GitHub — não é a marca.

| | |
|---|---|
**Produto** | **SELENE** |
**Repositório** | NAORIKY-SELENE (pasta do GitHub) |
Origem do nome | Selene, a deusa grega da Lua |
Comando | `sel` (apelido `selene` também válido) |
Base | OpenCode **2.2.5** (commit `8bca532`, branch `dev`) |
Autor do fork | Naoriky-VFX |
Licença | **MIT** — ver `LICENSE` (copyright original preservado) |

## Sobre a licença

O OpenCode é distribuído sob **MIT**. Este fork mantém o arquivo `LICENSE` e o
aviso de copyright original intactos, como a licença exige. O rebranding
(nome, tema, identidade visual) é trabalho novo deste projeto; o código de base
segue sendo dos autores originais (Anomaly / OpenCode).

## Tema

O tema `selene` fica em `packages/tui/src/theme/assets/v2/selene.json`
(roxo obsidiana + acento ciano, modos dark e light completos).

## Escopo de plataformas (decisão do dono)

| Alvo | Status |
|---|---|
**Windows x64** | ✅ principal — é onde o dono usa |
**Linux x64** | ✅ bônus (build nativo, barato) |
**Docker** | ✅ bônus (trivial) |
Windows ARM64 | 🔵 depois, se houver demanda |
Linux ARM64 | 🔵 depois (exige emulação ou runner ARM) |
**macOS (CLI e desktop)** | ❌ **FORA** |

### Por que macOS ficou fora

1. Não compila no Windows — exige host macOS nativo (o `release.yml` do
   upstream usa `macos-26` para `darwin-arm64`, e não faz cross-compile).
2. `electron-builder` não gera `.dmg` a partir do Windows.
3. Distribuir app macOS sem assinatura/notarização gera atrito real no
   Gatekeeper (inclusive quarentena em binário de CLI).
4. Build "limpo" exigiria Apple Developer (US$ 99/ano), que foi descartado.

**Nada foi removido do código:** uma pessoa com Mac ainda pode compilar da
fonte. Só não publicamos binário para macOS.

## Nota sobre o `AGENTS.md`

O guia de desenvolvimento do OpenCode veio junto no fork (16 KB de regras para
contribuir no projeto original). Ele foi renomeado para **`AGENTS.upstream.md`**
para não ser carregado como regra deste projeto.

As regras que valem aqui são as do **`REGRAS.md`** e do agente
`.opencode/agents/selene.md`.

## Como compilar (Windows x64)

```powershell
# 1. dependências (uma vez)
cd "D:\PROJETOS DE PROGRAMAÇÃO\NAORIKY-SELENE"
bun install

# 2. build da CLI
cd packages\cli
$env:OPENCODE_TARGET   = "windows-x64"
$env:OPENCODE_BIN      = "sel"
$env:OPENCODE_CLI_NAME = "sel"
$env:OPENCODE_VERSION  = "0.1.0"
$env:OPENCODE_CHANNEL  = "latest"
bun run build
```

Saída: `packages/cli/dist/cli-windows-x64/bin/sel.exe` (~252 MB, binário único).

Instalado nesta máquina em `%LOCALAPPDATA%\SELENE\sel.exe` (no PATH do usuário).

## Estado

- [x] Código do OpenCode 2.2.5 importado
- [x] Tema Selene criado
- [x] Escopo de plataformas definido (macOS fora)
- [x] Agente `selene` com regras editáveis (`.opencode/agents/selene.md`)
- [x] Guarda de conteúdo com 19 testes (`.opencode/plugins/selene-guard/`)
- [x] **Build Windows x64** — `sel v0.1.0` funcionando
- [x] Comando renomeado para `sel`
- [ ] Logo / ícone / identidade visual
- [ ] Workflow de release próprio (sem assinatura)
- [ ] Desktop / web rebrandados
