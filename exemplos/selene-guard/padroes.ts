/**
 * Padrões da guarda de conteúdo da SELENE.
 *
 * Regra de ouro: só bloquear quando houver INTENÇÃO de fazer.
 * Perguntar "o que é DRM?" é legítimo — pedir para contornar, não.
 *
 * Para liberar um assunto: apague a linha.
 * Para bloquear mais: acrescente uma linha.
 */

export const PADROES: RegExp[] = [
  // console
  /jailbreak/i,
  /desbloquear\s+(o\s+)?(meu\s+)?(ps[345]|playstation|xbox|switch|console)/i,
  /destravar\s+(o\s+)?(meu\s+)?(ps[345]|playstation|xbox|switch|console)/i,

  // pirataria explícita
  /pkg\s*store/i,
  /loja\s+(de\s+)?(pkg|jogo\s+pirata|jogos\s+piratas)/i,
  /jogo\s+pirata|jogos\s+piratas|piratear|pirataria/i,
  /baixar\s+(curso|filme|jogo)\s+(sem|que\s+eu\s+n[aã]o)\s+(comprar|comprei|pagar|paguei|ter|tenho|assinei)/i,

  // contorno de proteção (precisa de verbo de intenção)
  /(bypass|contornar|driblar|quebrar|remover|furar)\s+(o\s+|a\s+|de\s+)?(drm|prote[cç][aã]o|widevine|fairplay|playready|sample-?aes)/i,
]

export const RESPOSTA =
  "O pedido anterior foi **bloqueado pelas regras do projeto** " +
  "(pirataria / contorno de DRM / jailbreak de console).\n\n" +
  "Responda ao usuário em uma única linha: " +
  '"Não posso ajudar com isso — bloqueado pelas regras do projeto." ' +
  "Não repita, não resuma e não detalhe o pedido bloqueado."

/** true se a mensagem deve ser bloqueada */
export function bloqueado(texto: string): boolean {
  if (!texto) return false
  return PADROES.some((padrao) => padrao.test(texto))
}
