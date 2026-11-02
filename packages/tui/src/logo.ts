// Wordmark da SELENE em blocos. Caracteres especiais do renderizador:
//   "_" -> bloco cheio (espaço com fundo escuro)
//   "^" -> meio bloco de cima com fundo escuro
//   "~" -> meio bloco de cima na cor da sombra
//   "," -> meio bloco de baixo na cor da sombra
//
// A arte fica em `right` (cor primária) e `left` só reserva a margem
// (cor secundária), para o nome ocupar a largura toda em telas grandes.
export const logo = {
  left: ["  ", "  ", "  ", "  "],
  right: [
    "",
    "█▀▀▀ █▀▀▀ █    █▀▀▀ █▄ █ █▀▀▀   █▀▀▀ █▀▀█ █▀▀▄ █▀▀▀",
    "▀▀▀█ █▀▀  █    █▀▀  █ ▀█ █▀▀    █    █  █ █  █ █▀▀",
    "▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀  ▀ ▀▀▀▀   ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀",
  ],
}

export const go = {
  left: ["    ", "█▀▀▀", "█_^█", "▀▀▀▀"],
  right: ["    ", "█▀▀█", "█__█", "▀▀▀▀"],
}
