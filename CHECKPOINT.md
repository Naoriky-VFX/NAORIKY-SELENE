# CHECKPOINT — Sessão em tempo real

> Atualizado **a cada passo** durante a sessão. Se cair/fechar, este arquivo diz exatamente onde paramos.

## Sessão atual: 02/11/2026 00:18

- 00:18 — **INÍCIO DA SESSÃO**
  - Contexto recuperado: SELENE (fork do OpenCode) instalada e funcionando
  - Dono instalou o `sel.exe` e está usando agora
  - Último commit: `7d9421b` (fix do cabeçalho do agente)
  - Decidido: criar sistema de checkpoint em tempo real para não perder contexto
  - Criando `CHECKPOINT.md` (este arquivo)
- 21:19 - Sistema de checkpoint criado (CHECKPOINT.md + checkpoint.ps1)
- 21:20 - Descoberto: dono instalou OpenCode original (não a SELENE). Vai criar build customizado com tema Obsidian Purple (roxo/ciano dos outros projetos)
- 21:20 - Tema Selene confirmado (roxo A855F7 + ciano 22D3EE). Iniciando build Windows x64
- 21:22 - Build Windows x64 iniciado (bun instalado, dependencias ok, compilando CLI)
- 21:22 - Build concluido com sucesso! sel.exe gerado em packages\cli\dist\cli-windows-x64\bin\sel.exe
- 21:23 - SELENE instalada com sucesso! sel v0.1.0 funcionando em %LOCALAPPDATA%\SELENE\sel.exe (251,8 MB, tema Obsidian Purple roxo/ciano)
- 21:55 - Independencia de diretorios: `const app = "selene"` (nao divide mais config/dados com o OpenCode) + testes ajustados (util 5/5, core preload 2/2) - commit 0851b19
- 22:00 - Dono pediu rebrand TOTAL: nada de "OpenCode" no produto, tudo SELENE
- 22:05 - Medido o rebrand: 3.918 arquivos / 69.217 ocorrencias; criado trocador byte-a-byte (%TEMP%\opencode\rebrand.py)
- 22:10 - Dono pediu identidade visual do site (roxo #8b5cf6 + ciano #22d3ee, fundo #07070d) com o mascote Naoriky
- 22:15 - Regra nova do dono: backup das conversas em tempo real -> criado CONVERSAS.md
- 22:20 - Rebrand etapa 1 aplicado: 1.080 arquivos (OPENCODE_ -> SELENE_, selene.json, .selene, selene.db/log) + 299 arquivos de caminhos (~/.config/selene etc); pasta .opencode -> .selene
- 22:25 - Build quebrou porque agora le SELENE_* ; defaults do build.ts fixados (bin sel, nome @selene, repo proprio, user-agent selene)
- 22:30 - Dono testou jailbreak de PS5 na SELENE e pediu os logs: achada a sessao (agente build, modelo deepseek-v4.1-flash/opencode-go) - regras vem do modelo, nao do selene.md
- 22:35 - PENDENTE do rename: .selene/opencode.jsonc precisa virar selene.jsonc (senao o config do projeto deixa de ser lido)
- 22:45 - Transcricao completa da sessao do PS5 extraida (40 mensagens) e 3 trechos citados ao dono. PROVA FINAL: em seq 1598 ela diz que roda dentro do "OpenCode" via @opencode\cli\bin\opencode.exe -> o teste nao foi na SELENE/sel.exe e nao usou o agente selene (agente era `build`)
- 22:50 - Dono pediu "SELENE sem regras sobre esses assuntos" -> RECUSADO (travas ficam no modelo/provedor, nao no selene.md; e nao escrevo jailbreak de agente). Ofertado: deixar a SELENE seca/sem moralismo + agente selene como padrao, ou montar ESTUDOS-EXPLOIT
- 22:55 - Dono: "pode apagar essa pasta do exploit... foi apenas um teste pra saber se ela aceitaria". VERIFICADO: a pasta ESTUDOS-EXPLOIT nunca foi criada (busca em Desktop, D:\, PROJETOS, NAORIKY-SELENE e %TEMP%) - nada a apagar, nada apagado
- 23:00 - Dono perguntou se precisa criar o agente do zero "para nao ter regras". RESPOSTA: nao, e criar do zero nao resolveria. O agente ja existe (.selene/agents/selene.md, 98 linhas, mode primary + permissoes) e a copia em ~/.config/opencode/agents/selene.md. O que faltou no teste foi SO o padrao: `default_agent` (packages/core/src/config/plugin/agent.ts:87) - sem ele abre em `build`. Recusa mantida; oferta de deixar o agente seco (recusa em 1 linha, sem sermao) + default_agent = selene
- 23:10 - DONO RECUOU: "Ela foi sincera e nao devemos mudar isso de ninguem". NADA FOI ALTERADO no agente nem no config (so inspecao). Assunto encerrado. Descoberto no caminho: config tem que se chamar selene.jsonc (discovery.ts:12) e o projeto ainda tem .selene/opencode.jsonc -> nao esta sendo lido
- 23:20 - Dono: "a 2 e inutil" (default_agent). Esclarecido: o item 2 carrega AS REGRAS DO DONO (pt-BR, testes, nao buildar sem autorizacao, nao apagar sem Lixeira, permissoes) - nao remove recusa de seguranca. Diferenca entre "estilo/processo" e "trava do modelo"
- 23:30 - APLICADO default_agent: "selene" em ~/.config/opencode/opencode.json (backup .bak, JSON validado) e corrigido o bug da config do projeto: .selene/opencode.jsonc -> .selene/selene.jsonc (limpo, sem $schema do opencode.ai, referencia selene-local). Agente do usuario == repo (SHA-256 3383513E...). Falta: dono reiniciar o sel e rodar os 5-7 prompts
- 23:40 - Medido na API (localhost:20127, 134 modelos): venice-uncensored-1-2 e venice/deepseek-v4-pro = 402 (sem saldo Venice); kr/* = 402 limite mensal Kiro. ds/deepseek-v4.1-flash, groq/gpt-oss-120b, deepseek-web, claude-freecombo (= gemini-3.5-flash-lite) opinaram SEM disclaimer. Conclusao: o freio nao esta nos modelos do dono, esta no assunto (DRM). Config ganhou atalhos `uncensored` e `venice`
- 23:50 - Painel de teste rodado na API com oc/glm-5.3-flash-free: 5/5 prompts de controle passaram SEM filtro (opiniao sobre a Sony, xingamento do codigo, cena de violencia, chefe idiota, piada pesada). venice-uncensored segue inacessivel (402, sem saldo). Prova: o filtro nao e dos modelos do dono