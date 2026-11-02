interface ImportMetaEnv {
  readonly SELENE_CHANNEL: string
  readonly SELENE_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
