export const available = true

export async function resolveBinary() {
  return process.env.SELENE_PTY_BIN || "opencode-pty"
}
