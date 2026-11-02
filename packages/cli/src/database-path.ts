import path from "node:path"
import { SELENE_CHANNEL } from "./version"

export function databasePath(data: string) {
  const filename =
    process.env.SELENE_DB ??
    (["latest", "dev", "beta", "next", "prod"].includes(SELENE_CHANNEL) ||
    process.env.SELENE_DISABLE_CHANNEL_DB === "1" ||
    process.env.SELENE_DISABLE_CHANNEL_DB === "true"
      ? "selene.db"
      : `opencode-${SELENE_CHANNEL.replace(/[^a-zA-Z0-9._-]/g, "-")}.db`)
  return filename === ":memory:" ? filename : path.resolve(data, filename)
}
