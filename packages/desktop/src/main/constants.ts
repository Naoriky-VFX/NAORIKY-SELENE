import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.SELENE_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.SELENE_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "OpenCode Dev",
  beta: "OpenCode Beta",
  prod: "OpenCode",
}

const appIDs: Record<string, string> = {
  dev: "ai.selene.desktop.dev",
  beta: "ai.selene.desktop.beta",
  prod: "ai.selene.desktop",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "OpenCode Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "ai.selene.desktop.dev"
