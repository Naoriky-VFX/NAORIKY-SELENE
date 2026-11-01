# NAORIKY-SELENE

Terminal AI coding agent — fork rebrandeado do **OpenCode**.

| | |
|---|---|
Projeto | **NAORIKY-SELENE** |
Marca | **Selene** (deusa grega da Lua) |
Comando | `sel` |
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

## Estado

- [x] Código do OpenCode 2.2.5 importado
- [x] Tema Selene criado
- [x] Escopo de plataformas definido (macOS fora)
- [ ] Renomear comando `opencode` → `sel`
- [ ] Logo / ícone / identidade visual
- [ ] Build Windows x64
- [ ] Workflow de release próprio (sem assinatura)
- [ ] Desktop / web rebrandados
