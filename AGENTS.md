# Regras para agentes — NAORIKY-SELENE

> Este arquivo vale **só para quem trabalha neste projeto**. Outros projetos têm o `AGENTS.md`
> deles; nada aqui vaza para fora desta pasta.

---

## 1. Publicação: só com o "pode" do dono

**Nunca** crie release, tag ou publique no Marketplace por conta própria.

| Ação | Pode fazer sozinho? |
|---|---|
| Editar código | ✅ depois de ele autorizar a tarefa |
| `git add` / `commit` / `push` | ✅ **sempre** (é o backup principal) |
| Rodar testes | ✅ |
| Compilar para testar localmente | ✅ |
| Empacotar `.vsix`/`.exe` para teste | ✅ |
| **Criar tag / release no GitHub** | ❌ **só quando ele disser que está bom** |
| **Publicar no Marketplace** | ❌ só com autorização |
| `git push --force` | ❌ nunca |

Motivo: release é **publicação**, não backup. O que os usuários recebem é decidido por ele.

## 2. Backup contínuo

Todo avanço vai para o GitHub, mesmo que ainda esteja em andamento:

- commit a cada bloco de trabalho que funciona;
- mensagem de commit dizendo **o que** mudou e **por quê**;
- `main` é o branch de trabalho e o padrão do repositório.

O repositório é **público**. Nunca commite: `.env`, chaves de API, tokens, keystore, banco,
cookies ou dados de cliente. O `.gitignore` cobre a maior parte — confira antes.

## 3. Versionamento

- A versão do código **e** a tag do release precisam coincidir (`2.2.5` no binário ↔ `v2.2.5` na tag).
- Se divergirem, o verificador de atualização acusa versão nova para sempre.
- Enquanto não houver um número definitivo, use `0.x.y`.

## 4. Cuidado com o que já existe

- A SELENE é um **fork** do opencode (MIT). O crédito em `LICENSE` e `CREDITS.md` é obrigatório.
- Não renomeie imports `@opencode/*`, nem variáveis `OPENCODE_*` que o runtime espera.
- Cuidado com rename em massa: ele já quebrou `Provider.ID`, `opencodeChecks`, `opencodePtyAsset`
  e a URL do catálogo (`models.opencode.ai`). Sempre rode `bun run check` depois.

## 5. Antes de dizer "pronto"

1. `bun run check` verde (35 pacotes).
2. Testar o binário de verdade: rodar `sel --standalone --print-logs` e **procurar erro no log** —
   já houve caso de tema inválido que derrubava o TUI sem aparecer no `--version`.
3. Testar download do release em pasta isolada (variáveis `XDG_*` e `SELENE_CONFIG_DIR` próprias),
   sem tocar na config real nem no serviço em uso.
4. Informar o que mudou e o que **não** foi testado.

## 6. Não mexer no que é do dono

- `~/.config/selene/` e `%LOCALAPPDATA%\selene` — config e histórico dele.
- Terminais e sessões abertas (rodar em janela separada e isolada).
- `C:\LicencasServidor` — é outro projeto (PROJETO TEST), não este.
