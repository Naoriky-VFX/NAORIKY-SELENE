# Continuidade — NAORIKY-SELENE

> **Atualizado em:** 05/11/2026
> **Versão:** SELENE CODE **0.1.3** (extensão) · **2.2.5** (binário)
> **Branch:** `main` · padrão do repositório
> **Repositório:** https://github.com/Naoriky-VFX/NAORIKY-SELENE (público)

Fonte da verdade para retomar. O `AGENTS.md` tem as regras de trabalho (release só com autorização).

---

## Onde parou

**Nada pela metade.** Extensão 0.1.3 publicada no Marketplace.

| Item | Estado |
|---|---|
| Extensão `SELENE CODE` **0.1.3** | ✅ **no Marketplace** (`naoriky.selene`) — publicada em 03/11 16:03 UTC |
| Extensão `SELENE CODE` 0.1.2 | ⚪ versão anterior |
| Ícone na barra lateral | ✅ funcionando (verificado no VS Code do dono) |
| Release `v2.2.5` com `sel.exe` | ✅ no GitHub |
| Publicação automatizada | ✅ Trusted Publishing (`workflow_dispatch` em `publish-extension.yml`) |
| Update pelo GitHub | ✅ checagem + download + troca + reabrir |
| Tier gratuito | ✅ funcionando (4 modelos Free) |

### O que a 0.1.3 mudou

- **Barra lateral:** `viewsContainers.activitybar` + view `selene.home` com 4 ações
  (Open / New tab / Insert file reference / Install), mais botões no topo do painel.
- **Ícones:** `activity-icon.svg` (24×24, silhueta, o VS Code recolore no tema),
  `orb.png` e `orb-plus.png` (orb sem o texto "SELENE", legível em 16 px).
- **Bug corrigido:** os ícones dos comandos apontavam para `images/selene-orb-256.png` e
  `selene-orb-glow.png`, que o `.vscodeignore` **excluía do pacote** — chegavam quebrados.
- **Aba do terminal:** passou a usar `orb.png` (antes `terminal-icon.png`, com texto ilegível).
- **Dois botões** em `editor/title`: orb (abrir) e orb `+` (aba nova).
- **Tudo em inglês** para o cliente: README, CHANGELOG e as mensagens do código
  ("Installing SELENE", "cancelled", etc.).
- `LICENSE` dentro de `sdks/vscode` (acaba com o aviso do `vsce`) e campo `author`.

> **Limite conhecido:** os botões da barra de abas do terminal (o `+`, o split, a estrela) são
> internos do VS Code — extensão nenhuma injeta ícone ali.

---

## Sessão de 05/11 — painel naoriky e ponte com o opencode

**Nada quebrado.** A config do SELENE passou a espelhar o painel inteiro.

| Item | Estado |
|---|---|
| `~/.config/selene/selene.json` | 4 → **126 modelos** do painel `naoriky` |
| Backup | `%TEMP%\selene\selene.json.bak-20261105-043025` |
| `bats/` (âncora do agente) | `atualizar-agente.py`, `ABRIR-SELENE.bat/.ps1`, `AGENT SELENE.txt`, `PROMPT-SELENE.txt` |
| Fork `Naoriky-VFX/opencode` | recriado do `anomalyco/opencode` (branch `dev`) + remote `upstream` |
| Sync automático | `.github/workflows/sync-upstream.yml` — merge diário 06:00 UTC, **nunca** force |
| Clone local | `D:\PROJETOS DE PROGRAMAÇÃO\OPENCODE` — `bun install` + `bun run check` **35/35** |

### Descobertas

- **43 symlinks** do repo do opencode chegam como arquivo de texto no Windows
  (`core.symlinks=false`) → `@opencode/app` quebra com TS1128. Correção:
  `git config core.symlinks true` + `git checkout` dos 43 caminhos.
- Os `claude-*` do painel **não são Claude**: são etiquetas para as 3 gavetas do
  Claude Code (`ANTHROPIC_DEFAULT_SONNET/OPUS/HAIKU_MODEL` em `~/.claude/settings.json`).
  Atrás de cada um há DeepSeek, Gemini, Venice, Kiro, Grok.
- Os `oc/*` são do plano **opencode Go**. Dão 403 ("Go Teams covers workspace members,
  not service accounts") porque o painel chama com **service account**; Go exige
  chave **pessoal** do membro que tem o assento.
- `opencode.json` tem a chave `providers` (plural) com `modelID` — é schema V1 e o
  app **ignora**. A chave correta é `provider` e o campo é `id`.

### Pendências desta sessão

| # | O que |
|---|---|
| 1 | Espelhar os 126 no `opencode.json` e apagar o bloco `providers` morto |
| 2 | Trocar a chave do painel (apareceu no terminal em 05/11) |
| 3 | Testar os 126 modelos e marcar quais respondem |

---

## Decisões tomadas (não desfazer sem conversa)

| Tema | Decisão |
|---|---|
| Nome do produto | **SELENE** — extensão chamada **SELENE CODE** |
| Comando padrão | `selene` (o `sel` continua como atalho) |
| Comando `ag` | **invenção nossa** — não é padrão de mercado; não divulgar |
| Agentes | `selene` = o do projeto (padrão) · `build` = genérico/plano B · `plan` = só leitura |
| Provedor grátis | rótulo **SELENE FREE** (id interno segue `opencode`) |
| Tier grátis | exige cliente ≥1.18.0 → enviamos `2.2.5` **só nesta conexão**; a tela mostra a versão real |
| Versão | binário acompanha a tag do release (`2.2.5`) |
| Publicação | **só quando o dono disser "está bom"** |
| Créditos | `LICENSE` + `CREDITS.md` obrigatórios (fork MIT do opencode) |

---

## Como publicar uma versão nova (automatizado)

1. Editar `sdks/vscode/package.json` → subir `version`
2. Commit + push
3. Disparar o workflow (só `workflow_dispatch` — push **não** publica):

```powershell
POST /repos/Naoriky-VFX/NAORIKY-SELENE/actions/workflows/publish-extension.yml/dispatches
{"ref":"main"}
```

O workflow instala dependências, roda `vsce publish --oidc` e publica sozinho.
**Não precisa token do Azure** (Trusted Publishing via OIDC).
O índice da loja leva ~4 min para mostrar a versão nova.

---

## Armadilhas aprendidas hoje

| Armadilha | Consequência |
|---|---|
| **YAML do workflow** com `: ` dentro de um `run:` sem aspas | arquivo inválido → 0 jobs, `workflow_dispatch` não registra |
| Política do Trusted Publishing cita o **nome do arquivo** do workflow | se renomear o `.yml`, dá **401** "token could not be exchanged" |
| Rename em massa `opencode` → `selene` | quebrou `Provider.ID`, `opencodeChecks`, `opencodePtyAsset`, a URL `models.opencode.ai` e o tema (`hue.line`) |
| Tema com chave inválida | o **TUI não abre** (mas o serviço responde 200 — engana) |
| Mensagem de update | comparava "diferente" em vez de "maior" → oferecia **downgrade** |
| `vsce` upload manual | só cria extensão nova; **não atualiza** existente |

---

## Pendências

| # | O que | Observação |
|---|---|---|
| 1 | ~64 testes do TUI | cosméticos (largura de texto, tema) — nada de uso |
| 2 | 5 testes de brew/winget | caminhos que não usamos |
| 3 | 295 testes do core | ambiente (shell Unix/ripgrep no Windows) |
| 4 | Testar a SELENE instalada pela loja numa máquina limpa | validação final |

---

## Arquivos-chave

| Arquivo | Para quê |
|---|---|
| `sdks/vscode/src/extension.ts` | extensão: abre terminal, baixa o binário |
| `sdks/vscode/package.json` | nome, versão, ícone, atalhos |
| `packages/cli/src/services/updater.ts` | update pelo GitHub |
| `packages/cli/src/services/updater-action.ts` | comparação de versão (sem downgrade) |
| `packages/core/src/plugin/provider/opencode.ts` | tier grátis (versão compatível no UA) |
| `packages/tui/src/logo.ts` | wordmark SELENE CODE |
| `.github/workflows/publish-extension.yml` | publicação no Marketplace |
