# SELENE

Agente de programação no terminal, dentro do VS Code.

A extensão abre a **SELENE** numa aba ao lado do seu código e já cuida da instalação: se o agente
ainda não existir na máquina, ela baixa e configura sozinha.

## Instalação

1. Instale a extensão pela loja do VS Code.
2. `Ctrl+Alt+Esc` — se a SELENE não estiver instalada, aparece o convite para baixar (~260 MB).
3. Aceite. Ela baixa, salva em `%LOCALAPPDATA%\SELENE`, põe no `PATH` e abre o terminal.

Pronto: o terminal abre com o agente rodando na pasta do seu projeto.

## Atalhos

| Atalho (Windows/Linux) | Atalho (macOS) | O que faz |
|---|---|---|
| `Ctrl+Alt+Esc` | `Cmd+Alt+Esc` | Abre a SELENE (foca a aba se já existir) |
| `Ctrl+Alt+Shift+Esc` | `Cmd+Alt+Shift+Esc` | Abre uma aba nova da SELENE |
| `Ctrl+Alt+S` | `Cmd+Alt+S` | Insere a referência do arquivo/trecho atual |

Os três também aparecem na paleta de comandos (`Ctrl+Shift+P` → "SELENE").

## O que a extensão faz

- **Abre o agente ao lado do código** — não troca sua aba atual.
- **Instala sozinha** — procura `sel` no `PATH`; se não achar, baixa a versão mais recente do
  GitHub Releases, salva em `%LOCALAPPDATA%\SELENE\sel.exe` e acrescenta a pasta ao `PATH`.
- **Mostra o progresso** do download na barra de notificações.
- **Reaproveita a sessão** — se já existe uma aba chamada SELENE, ela só recebe o foco.
- **Contexto do editor** — com um trecho selecionado, o atalho insere `@arquivo#12-30`.

## Comandos

| Comando | Descrição |
|---|---|
| `SELENE: Abrir` | Abre o terminal da SELENE |
| `SELENE: Nova aba` | Abre uma sessão nova |
| `SELENE: Instalar` | Baixa/reinstala o agente |
| `SELENE: Inserir arquivo mencionado` | Manda `@arquivo#linhas` para o terminal |

## Requisitos

- VS Code 1.94 ou superior
- Windows, macOS ou Linux
- Conexão com a internet na primeira execução (para baixar o agente)

Depois de instalado, o agente funciona offline para as tarefas locais; só os modelos precisam de rede.

## Configuração

A SELENE guarda tudo em:

| Sistema | Pasta |
|---|---|
| Windows | `%LOCALAPPDATA%\selene` e `%USERPROFILE%\.config\selene` |
| macOS/Linux | `~/.config/selene` e `~/.local/share/selene` |

Nada é compartilhado com outras instalações de agentes.

## Problemas comuns

| Sintoma | Solução |
|---|---|
| "A SELENE ainda não está instalada" | Aceite o download, ou rode `SELENE: Instalar` |
| Download falha | Baixe manualmente em [releases](https://github.com/Naoriky-VFX/NAORIKY-SELENE/releases/latest) e salve como `%LOCALAPPDATA%\SELENE\sel.exe` |
| Atalho não responde | Verifique conflito em *Preferências → Atalhos de teclado*, buscando "SELENE" |
| Terminal abre e fecha | Abra um terminal comum e rode `sel` para ver o erro |

## Licença

MIT.
