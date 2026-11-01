/**
 * SELENE — guarda de conteúdo
 *
 * Trava ANTES do prompt chegar no modelo. Se a mensagem casar com um padrão de
 * `padroes.ts`, o texto é substituído por uma recusa: o modelo nunca vê o pedido.
 *
 * Edite `padroes.ts` para mudar o que é bloqueado.
 * (Isto é código, não pedido de gentileza — vale com qualquer modelo.)
 */
import { Plugin } from "@opencode/plugin"
import { RESPOSTA, bloqueado } from "./padroes.ts"

export default Plugin.define({
  id: "selene-guard",
  async setup(ctx) {
    ctx.session.hook("prompt", (event) => {
      try {
        const texto = event?.prompt?.text ?? ""
        if (!bloqueado(texto)) return

        // troca o conteúdo antes de qualquer coisa chegar no modelo
        event.prompt = { text: RESPOSTA }
      } catch {
        // nunca deixe a guarda derrubar a sessão
      }
    })
  },
})
