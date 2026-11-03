# SELENE CODE

AI coding agent in the terminal, inside VS Code.

The extension opens SELENE in a tab next to your code and handles the installation for you: if the
agent isn't on the machine yet, it downloads and configures itself.

## Installation

1. Install the extension from the VS Code Marketplace.
2. `Ctrl+Alt+Esc` — if SELENE isn't installed, you'll be prompted to download it (~260 MB).
3. Accept. It downloads the agent, saves it to `%LOCALAPPDATA%\SELENE`, adds it to the PATH and
   opens the terminal.

Done: the terminal opens with the agent running in your project folder.

## Shortcuts

| Shortcut (Windows/Linux) | Shortcut (macOS) | What it does |
|---|---|---|
| `Ctrl+Alt+Esc` | `Cmd+Alt+Esc` | Opens SELENE (focuses the tab if it already exists) |
| `Ctrl+Alt+Shift+Esc` | `Cmd+Alt+Shift+Esc` | Opens a new SELENE tab |
| `Ctrl+Alt+S` | `Cmd+Alt+S` | Inserts a reference to the current file/selection |

All three are also available in the Command Palette (`Ctrl+Shift+P` → "SELENE").

## What the extension does

- **Opens the agent beside your code** — it doesn't switch your current tab.
- **Installs itself** — looks for `sel` in the PATH; if it isn't there, it downloads the latest
  version from GitHub Releases, saves it to `%LOCALAPPDATA%\SELENE\sel.exe` and adds the folder to
  the PATH.
- **Shows download progress** in the notification bar.
- **Reuses the session** — if a tab named SELENE already exists, it just gets focus.
- **Editor context** — with a selection, the shortcut inserts `@file#12-30`.
- **Sidebar** — SELENE has its own icon in the activity bar, with quick actions.

## Commands

| Command | Description |
|---|---|
| `SELENE: Open` | Opens the SELENE terminal |
| `SELENE: New tab` | Opens a new session |
| `SELENE: Install` | Downloads/reinstalls the agent |
| `SELENE: Insert file reference` | Sends `@file#lines` to the terminal |

## Requirements

- VS Code 1.94 or later
- Windows, macOS or Linux
- Internet connection on the first run (to download the agent)

Once installed, the agent works offline for local tasks; only the models need a network connection.

## Configuration

SELENE stores everything in:

| System | Folder |
|---|---|
| Windows | `%LOCALAPPDATA%\selene` and `%USERPROFILE%\.config\selene` |
| macOS/Linux | `~/.config/selene` and `~/.local/share/selene` |

Nothing is shared with other agent installations.

## Common problems

| Symptom | Solution |
|---|---|
| "SELENE is not installed yet" | Accept the download, or run `SELENE: Install` |
| Download fails | Download it manually from [Releases](https://github.com/Naoriky-VFX/NAORIKY-SELENE/releases/latest) and save it as `%LOCALAPPDATA%\SELENE\sel.exe` |
| Shortcut doesn't respond | Check for a conflict in *Preferences → Keyboard Shortcuts*, searching for "SELENE" |
| Terminal opens and closes | Open a regular terminal and run `sel` to see the error |

## License

MIT
