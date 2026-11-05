# ENTENDA O PROJETO — NAORIKY-SELENE

> Escrito pela SELENE em 05/11/2026, a partir da leitura do código (não de memória de conversa).
> Serve para retomar sem precisar do histórico: **o que é**, **como funciona**, **como trabalhar**.
> Conferir sempre com `CONTINUAR.md` (estado) e `AGENTS.md` (regras).

---

## 1. O que é

Fork **MIT** do `anomalyco/opencode`, rebrandeado como **SELENE**. Três produtos:

| Produto | O que é | Onde |
|---|---|---|
| `selene` / `sel` | agente de programação no terminal (CLI + TUI) | `packages/cli`, `packages/tui` |
| **SELENE CODE** 0.1.3 | extensão do VS Code: abre o agente no terminal e baixa o binário | `sdks/vscode` |
| app web/desktop | interface gráfica (SolidStart + Electron) | `packages/app`, `packages/desktop` |

Versão do código hoje: **2.2.5** (igual à tag `v2.2.5` do release). Regra: código e tag sempre juntos.

---

## 2. Como funciona por dentro

```
selene (TUI)  --HTTP-->  serviço local  --SQLite-->  ~/.local/share/selene/selene.db
   packages/tui           packages/server                  (sessões, mensagens, custo)
                          packages/core (motor)
                                |
                                +--> providers de modelo (AI SDK / packages/ai)
                                +--> ferramentas (read, edit, bash, grep, task...)
                                +--> permissões, agentes, skills, MCP, plugins
```

- O TUI **não** roda o modelo: ele é cliente. Quem pensa é o serviço.
- Três modos, pelas flags globais (`packages/cli/src/commands/commands.ts`):
  `--standalone` (servidor privado junto), `--server <url>` (conectar num já aberto) e o padrão
  (usa o **serviço de fundo** — no PC é o processo `opencode.exe serve --service`).
- `selene service status|start|restart` controla esse serviço.
- Toda configuração é descoberta por arquivo: `packages/core/src/config/discovery.ts` aceita
  **`selene.json` / `selene.jsonc`** (não `opencode.json`). Se o arquivo tiver o nome errado, ele
  simplesmente não é lido — sem erro.
- Pastas de dados usam `const app = "selene"` (`packages/util/src/global.ts`):
  `~/.config/selene` (config), `~/.local/share/selene` (dados/DB/logs), `~/.cache/selene`,
  `~/.local/state/selene`. `%LOCALAPPDATA%\SELENE` guarda o `sel.exe` instalado.
- No projeto, a config é `.selene/` (`selene.jsonc` + `agents/`, `command/`, `skills/`, `themes/`,
  `plugins/`, `tool/`). O `AGENTS.md` da raiz é carregado como instrução do agente.

### Fluxo de uma mensagem

1. TUI envia o prompt para a sessão (`packages/core/src/session/prompt.ts`).
2. O motor monta o contexto: `AGENTS.md`, instruções, histórico, anexos (`system-prompt.ts`, `context.ts`).
3. Escolhe agente e modelo; o agente define permissões (`permission`), estilo e ferramentas.
4. Chama o provedor (`packages/ai`), recebe texto e/ou chamadas de ferramenta.
5. Ferramenta pede permissão quando a regra não é `allow` → o TUI mostra o pedido.
6. Resultado volta como evento para o TUI; a sessão grava mensagens e custo no SQLite.
7. Ao passar do limite de contexto, roda compactação (`session/compaction.ts`).

### Onde ficam as peças

| Peça | Pasta |
|---|---|
| motor (sessão, config, permissão, tools, agentes) | `packages/core/src` |
| servidor HTTP da API | `packages/server/src` (handlers), `packages/protocol` |
| TUI (Solid + OpenTUI), temas | `packages/tui/src` |
| CLI, flags, updater, serviço | `packages/cli/src` (+ `services/updater*.ts`) |
| provedores/modelos | `packages/ai/src`, `packages/core/src/plugin/provider/*` |
| banco (drizzle) | `packages/core/src/database`, `packages/effect-drizzle-sqlite` |
| tema roxo/ciano | `packages/tui/src/theme`, `packages/theme` |
| extensão VS Code | `sdks/vscode/src/extension.ts` |

---

## 3. Como trabalhar

Ferramentas: **Bun 1.4.4** (obrigatório, é o `packageManager`), Node só de apoio, Windows x64.

```powershell
bun install                  # dependências (postinstall corrige node-pty)
bun run check                # lint (oxlint + ast-grep) + typecheck — 35 pacotes, é o portão
bun run dev                  # roda a TUI em desenvolvimento
bun test                     # NÃO na raiz (o script da raiz falha de propósito)
bun test --cwd packages/core # teste por pacote; na TUI: --timeout 30000
```

Compilar o binário (só com autorização do dono, é build):

```powershell
cd packages/cli
$env:SELENE_BIN="sel"; $env:SELENE_TARGET="windows-x64"; $env:SELENE_VERSION="2.2.5"
bun run script/build.ts
# saída: packages/cli/dist/<alvo>/bin/sel.exe
```

Está em `packages/cli/script/build.ts`: `SELENE_BIN` (nome final), `SELENE_TARGET`
(`windows-x64`, `linux-arm64`, `darwin-arm64`...), `--single` (só a plataforma atual),
`--skip-web-ui`, `--skip-install`, `--outdir=`.

Extensão: `sdks/vscode/package.json` (`naoriky.selene`, versão própria 0.1.x). Publicação é
**só** pelo workflow `.github/workflows/publish-extension.yml` via `workflow_dispatch`
(Trusted Publishing/OIDC, sem token). Push não publica.

### Regras de ouro

1. **Não renomear** `@opencode/*` (imports), `OPENCODE_*` de runtime, nem a URL do catálogo
   `models.opencode.ai` — já quebrou `Provider.ID`, tema e updater no passado.
2. Build, tag, release e publicação: **só com "pode"** do dono. Commit e push: sempre.
3. `bun run check` verde antes de dizer "pronto"; depois testar o binário de verdade
   (`sel --standalone --print-logs`) e **procurar erro no log** — tema inválido derruba o TUI
   sem aparecer no `--version`.
4. Nada de chave/token em arquivo versionado: o repositório é **público**.
5. Depois de mexer em `packages/*`, testar em pasta isolada (`SELENE_CONFIG_DIR`, `XDG_*` próprios)
   para não sujar a config real do dono.

---

## 4. Armadilhas já pagas

| Armadilha | Efeito |
|---|---|
| Nome de config errado (`opencode.jsonc` em vez de `selene.jsonc`) | arquivo ignorado, sem aviso |
| Schema V1 (`providers` plural, campo `modelID`) | o app ignora; o certo é `provider` e `id` |
| Mass rename `opencode` → `selene` | quebra provider, tema e updater |
| Tema com chave inválida | TUI não abre; o serviço responde 200 e engana |
| Symlinks do repo no Windows (`core.symlinks=false`) | `@opencode/app` quebra com TS1128 |
| Updater comparando "diferente" em vez de "maior" | oferece downgrade |
| `vsce` upload manual | só cria extensão nova, não atualiza |
| Modelos sem *tool calling* (ex.: combos "uncensored") | 503 em toda requisição com `tools` |

---

## 5. O que NÃO existe aqui (não procure)

- `sync-upstream.yml` **não** está neste repositório: a ponte diária com o upstream
  (`anomalyco/opencode`) vive no fork `D:\PROJETOS DE PROGRAMAÇÃO\OPENCODE`.
- Os workflows de release do upstream estão em `.github/workflows-upstream/` (referência,
  não ativos). O único ativo é `publish-extension.yml`.
- `CONTINUAR.md`/`CONVERSAS.md`/`CHECKPOINT.md` são documentação de trabalho, não código.

---

## 6. Fontes deste resumo

Lido para escrever: `package.json`, `turbo.json`, `packages/cli/package.json`,
`packages/cli/src/index.ts`, `packages/cli/src/commands/commands.ts`, `packages/cli/script/build.ts`,
`packages/cli/src/database-path.ts`, `packages/core/src/config/discovery.ts`,
`packages/util/src/global.ts`, `sdks/vscode/package.json`, `sdks/vscode/src/extension.ts`,
listagem de `packages/`, `services/`, `.github/`, e `git log`/`git remote`.

**Não testado nesta análise:** compilar o binário, rodar `bun run check`, abrir a TUI de dev
e publicar a extensão. Só leitura de código e de estado.
