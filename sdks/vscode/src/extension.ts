// SELENE para VS Code
//
// Abre o agente SELENE num terminal ao lado e, se o binário `sel` ainda não
// existir na máquina, oferece baixá-lo e instalar em %LOCALAPPDATA%\SELENE.
import * as vscode from "vscode"
import * as https from "https"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"

const TERMINAL_NAME = "SELENE"
const RELEASES = "https://github.com/Naoriky-VFX/NAORIKY-SELENE/releases/latest/download"

const IS_WIN = process.platform === "win32"
const BIN = IS_WIN ? "sel.exe" : "sel"
const INSTALL_DIR = IS_WIN
  ? path.join(process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local"), "SELENE")
  : path.join(os.homedir(), ".local", "bin")
const INSTALL_PATH = path.join(INSTALL_DIR, BIN)
const DOWNLOAD_URL = `${RELEASES}/${IS_WIN ? "sel.exe" : "sel"}`
const DOWNLOAD_PAGE = "https://github.com/Naoriky-VFX/NAORIKY-SELENE/releases/latest"

export function deactivate() {}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("selene.home", new ActionsProvider()),
    vscode.commands.registerCommand("selene.openNewTerminal", () => openTerminal(context, true)),
    vscode.commands.registerCommand("selene.openTerminal", async () => {
      const existing = vscode.window.terminals.find((t) => t.name === TERMINAL_NAME)
      if (existing) {
        existing.show()
        return
      }
      await openTerminal(context, true)
    }),
    vscode.commands.registerCommand("selene.addFilepathToTerminal", () => {
      const fileRef = getActiveFile()
      if (!fileRef) return
      const terminal = vscode.window.activeTerminal
      if (!terminal || terminal.name !== TERMINAL_NAME) return
      terminal.sendText(fileRef, false)
      terminal.show()
    }),
    vscode.commands.registerCommand("selene.install", () => ensureBinary(context, true)),
  )
}

// ───────────────────────────── painel lateral ─────────────────────────────
// Ações rápidas que aparecem na barra lateral do VS Code (icone da SELENE).
class ActionsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(item: vscode.TreeItem) {
    return item
  }

  getChildren(): vscode.TreeItem[] {
    const acao = (titulo: string, comando: string, icone: string, dica: string) => {
      const item = new vscode.TreeItem(titulo, vscode.TreeItemCollapsibleState.None)
      item.command = { command: comando, title: titulo }
      item.iconPath = new vscode.ThemeIcon(icone)
      item.tooltip = dica
      return item
    }

    return [
      acao("Open SELENE", "selene.openTerminal", "play", "Open the agent in a terminal tab"),
      acao("New tab", "selene.openNewTerminal", "add", "Open a second SELENE session"),
      acao("Insert file reference", "selene.addFilepathToTerminal", "symbol-reference", "Send @file#lines to the terminal"),
      acao("Install or update the agent", "selene.install", "cloud-download", "Download the latest SELENE binary"),
    ]
  }
}

// ───────────────────────────── terminal ─────────────────────────────
async function openTerminal(context: vscode.ExtensionContext, forceNew: boolean) {
  const bin = await ensureBinary(context, false)
  if (!bin) return

  const terminal = vscode.window.createTerminal({
    name: TERMINAL_NAME,
    iconPath: vscode.Uri.file(context.asAbsolutePath("images/orb.png")),
    location: forceNew
      ? { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false }
      : { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false },
    env: { SELENE_CALLER: "vscode" },
  })

  terminal.show()
  terminal.sendText(bin === "sel" ? "sel" : `& "${bin}"`)
}

// ───────────────────────────── binário ─────────────────────────────
// Devolve o comando a usar ("sel" quando está no PATH) ou undefined se o
// utilizador recusou a instalação.
async function ensureBinary(context: vscode.ExtensionContext, manual: boolean): Promise<string | undefined> {
  if (which("sel")) return "sel"

  if (fs.existsSync(INSTALL_PATH)) {
    rememberInPath(INSTALL_DIR)
    return INSTALL_PATH
  }

  if (!manual) {
    const escolha = await vscode.window.showWarningMessage(
      "SELENE is not installed on this machine yet. Download it now?",
      "Download (~260 MB)",
      "Not now",
      "See instructions",
    )
    if (escolha === "See instructions") {
      void vscode.env.openExternal(vscode.Uri.parse(DOWNLOAD_PAGE))
      return undefined
    }
    if (escolha !== "Download (~260 MB)") return undefined
  }

  return vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "Installing SELENE", cancellable: true },
    async (progress, token) => {
      try {
        fs.mkdirSync(INSTALL_DIR, { recursive: true })
        const temp = `${INSTALL_PATH}.download`
        await download(DOWNLOAD_URL, temp, progress, token)
        if (token.isCancellationRequested) {
          safeUnlink(temp)
          return undefined
        }
        fs.renameSync(temp, INSTALL_PATH)
        if (!IS_WIN) fs.chmodSync(INSTALL_PATH, 0o755)
        rememberInPath(INSTALL_DIR)
        progress.report({ message: "done" })
        void vscode.window.showInformationMessage("SELENE installed.")
        return INSTALL_PATH
      } catch (error) {
        safeUnlink(`${INSTALL_PATH}.download`)
        const msg = error instanceof Error ? error.message : String(error)
        const acao = await vscode.window.showErrorMessage(
          `Could not install SELENE: ${msg}`,
          "Open the download page",
        )
        if (acao) void vscode.env.openExternal(vscode.Uri.parse(DOWNLOAD_PAGE))
        return undefined
      }
    },
  )
}

function which(cmd: string): string | undefined {
  const dirs = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean)
  const exts = IS_WIN ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";") : [""]
  for (const dir of dirs) {
    for (const ext of exts) {
      const candidato = path.join(dir, cmd + ext.toLowerCase())
      try {
        if (fs.existsSync(candidato)) return candidato
      } catch {
        // pasta inacessível: segue
      }
    }
  }
  return undefined
}

function safeUnlink(file: string) {
  try {
    fs.unlinkSync(file)
  } catch {
    // nada a fazer
  }
}

// Acrescenta a pasta ao PATH do processo e, no Windows, ao PATH do usuário.
function rememberInPath(dir: string) {
  if (!(process.env.PATH ?? "").split(path.delimiter).includes(dir)) {
    process.env.PATH = `${dir}${path.delimiter}${process.env.PATH ?? ""}`
  }
  if (!IS_WIN) return
  const atual = process.env.PATH ?? ""
  if (atual.includes(dir)) return
  // melhor esforço: grava no PATH do usuário para os próximos terminais
  const { execFile } = require("child_process") as typeof import("child_process")
  execFile(
    "powershell",
    ["-NoProfile", "-Command", `[Environment]::SetEnvironmentVariable('PATH',[Environment]::GetEnvironmentVariable('PATH','User') + ';${dir}','User')`],
    () => undefined,
  )
}

function download(url: string, destino: string, progress: vscode.Progress<{ message?: string }>, token: vscode.CancellationToken, saltos = 0): Promise<void> {
  return new Promise((resolve, reject) => {
    if (saltos > 5) return reject(new Error("redirecionamentos demais"))
    const req = https.get(url, { headers: { "User-Agent": "selene-vscode" } }, (res) => {
      const status = res.statusCode ?? 0
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume()
        return resolve(download(res.headers.location, destino, progress, token, saltos + 1))
      }
      if (status !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${status}`))
      }

      const total = Number(res.headers["content-length"] ?? 0)
      let baixado = 0
      const arquivo = fs.createWriteStream(destino)

      token.onCancellationRequested(() => {
        req.destroy()
        arquivo.close()
        reject(new Error("cancelled"))
      })

      res.on("data", (chunk: Buffer) => {
        baixado += chunk.length
        if (total > 0) {
          const pct = Math.round((baixado / total) * 100)
          progress.report({ message: `${pct}% (${Math.round(baixado / 1048576)} de ${Math.round(total / 1048576)} MB)` })
        }
      })

      res.pipe(arquivo)
      arquivo.on("finish", () => arquivo.close(() => resolve()))
      arquivo.on("error", reject)
      res.on("error", reject)
    })
    req.on("error", reject)
  })
}

// ───────────────────────────── contexto do editor ─────────────────────────────
function getActiveFile() {
  const activeEditor = vscode.window.activeTextEditor
  if (!activeEditor) return

  const document = activeEditor.document
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)
  if (!workspaceFolder) return

  const relativePath = vscode.workspace.asRelativePath(document.uri)
  let filepathWithAt = `@${relativePath}`

  const selection = activeEditor.selection
  if (!selection.isEmpty) {
    const startLine = selection.start.line + 1
    const endLine = selection.end.line + 1
    filepathWithAt += startLine === endLine ? `#${startLine}` : `#${startLine}-${endLine}`
  }

  return filepathWithAt
}
