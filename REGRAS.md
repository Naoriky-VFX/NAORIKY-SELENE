# Como mudar as minhas regras (1 página)

O arquivo que manda em mim é:

```
.opencode/agents/selene.md
```

Abra, edite, salve. **Não precisa compilar nem reinstalar.** Na próxima mensagem
o comportamento já mudou (o OpenCode recarrega config sozinho).

---

## 1. As permissões (o que eu posso tocar)

Ficam no topo do arquivo, entre os `---`:

```yaml
permissions:
  - action: edit                # editar/criar arquivo
    resource: "*"               # qualquer arquivo
    effect: allow               # allow = pode | ask = pergunta | deny = bloqueado
```

### Ações que existem

| action | Controla |
|---|---|
`edit` | editar, criar e apagar arquivos |
`shell` | rodar comando no terminal |
`external_directory` | sair da pasta do projeto |
`websearch` | buscar na web |
`subagent` | disparar subagente |

### Efeitos

| effect | Comportamento |
|---|---|
`allow` | faz sem perguntar |
`ask` | **pergunta antes** |
`deny` | recusa na hora |

> `resource` é o padrão do comando. `"git push *"` casa com `git push origin main`;
> `"*"` casa com tudo.

---

## 2. As regras de comportamento (o que eu penso)

Ficam no corpo do arquivo, em texto. **Edite à vontade.** Exemplos:

| Você escreve | Efeito |
|---|---|
"Rode os testes antes de dizer pronto" | passo a testar sempre |
"Não reinicie o servidor; eu mesmo faço" | paro de reiniciar |
"Responda em inglês" | mudo o idioma |
"Nunca use emoji" | paro de usar |
"Sempre mostre o diff antes de editar" | passo a pedir aprovação visual |

---

## 3. O limite (importante)

| Tipo de regra | É garantia? |
|---|---|
Texto no `AGENTS.md` / `selene.md` | 🟡 **forte, mas não cadeado** |
`permissions` (`deny`) | ✅ **garantia** — o programa bloqueia |
Filtro no código da SELENE | ✅ **garantia total**, antes do modelo |

**Regra prática:**

- quer **proibir** algo? → `effect: deny`
- quer **incentivar** algo? → escreva no texto
- quer **garantir contra qualquer modelo**? → tem que ir no **código**

Você pode me deixar **mais restrita**. Não consegue me deixar **mais permissiva**
do que o modelo permite.

---

## 4. Como testar uma mudança

1. Edite o `selene.md`
2. No OpenCode, rode `/agents` e escolha **selene** (ou pressione `Tab`)
3. Faça um pedido que mostre a diferença
4. Não gostou? `Ctrl+Z` no arquivo, salve de novo

---

## Exemplo pronto: proibir terminal de vez

```yaml
permissions:
  - action: shell
    resource: "*"
    effect: deny
```

Só isso. Eu fico impedida de rodar **qualquer** comando, para sempre — em
qualquer modelo, em qualquer humor. É assim que uma regra de verdade se parece.

---

## 5. A trava garantida (filtro de conteúdo)

Além do texto e das permissões, existe um **filtro em código** que age **antes**
de o pedido chegar no modelo:

```
.opencode/plugins/selene-guard/
├── index.ts         ← liga o gancho (não precisa mexer)
├── padroes.ts       ← AQUI você edita o que é bloqueado
└── padroes.test.ts  ← 19 testes provando que bloqueia o certo e libera o resto
```

Como funciona: se a mensagem casar com um padrão, o texto é **trocado** por uma
recusa e o modelo **nunca vê** o pedido original.

| Para... | Faça |
|---|---|
liberar um assunto | apague a linha em `padroes.ts` |
bloquear mais | acrescente uma linha `/[seu padrão]/i,` |
conferir | `cd .opencode/plugins/selene-guard` e `bun test` |

Já bloqueia: jailbreak de console, PKG store, jogo/curso pirata, e **contornar
DRM** (Widevine/FairPlay/PlayReady/SAMPLE-AES).

Já **libera** (de propósito): *"o que é DRM?"*, *"explica o que é widevine"* —
perguntar é legítimo; pedir para contornar, não.

