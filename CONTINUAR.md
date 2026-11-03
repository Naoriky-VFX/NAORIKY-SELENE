# Continuidade — NAORIKY-SELENE

> **Atualizado em:** 03/11/2026
> **Versão:** SELENE CODE **0.1.3** (extensão) · **2.2.5** (binário)
> **Branch:** `main` · padrão do repositório
> **Repositório:** https://github.com/Naoriky-VFX/NAORIKY-SELENE (público)

Fonte da verdade para retomar. O `AGENTS.md` tem as regras de trabalho (release só com autorização).

---

## Onde parou

**Extensão 0.1.3 pronta e testada localmente; falta publicar no Marketplace.**

| Item | Estado |
|---|---|
| Extensão `SELENE CODE` **0.1.3** | 🟡 `.vsix` gerado e instalado no VS Code do dono — **não publicada** |
| Extensão `SELENE CODE` 0.1.2 | ✅ no Marketplace (`naoriky.selene`) |
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
3. Disparar o workflow:

```powershell
# endpoint usado (token do GitHub já salvo no PC tem escopo workflow)
POST /repos/Naoriky-VFX/NAORIKY-SELENE/actions/workflows/publish-extension.yml/dispatches
{"ref":"main"}
```

O workflow instala dependências, roda `vsce publish --oidc` e publica sozinho.
**Não precisa token do Azure** (Trusted Publishing via OIDC).

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
