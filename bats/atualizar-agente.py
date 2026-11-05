"""Atualiza a etiqueta do agente (bats/AGENT SELENE.txt) com a sessao mais recente
desta pasta e grava o ID em bats/.sessao (esse arquivo fica fora do git).

Banco lido: %USERPROFILE%\\.local\\share\\selene\\selene.db (tabela session_v2).

Uso:
    python bats\\atualizar-agente.py        # descobre e atualiza
    python bats\\atualizar-agente.py -v     # mostra o que fez
    python bats\\atualizar-agente.py --limpar  # so mostra a sessao encontrada
"""

import datetime
import os
import sqlite3
import sys

PROJETO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DB = os.path.join(os.path.expanduser("~"), ".local", "share", "selene", "selene.db")
ETIQUETA = os.path.join(PROJETO, "bats", "AGENT SELENE.txt")
ARQ_SESSAO = os.path.join(PROJETO, "bats", ".sessao")

VERBOSO = "-v" in sys.argv or "--verbose" in sys.argv
LIMPAR = "--limpar" in sys.argv


def log(msg):
    if VERBOSO or LIMPAR:
        print(msg)


def normalizar(caminho):
    """Compara pastas sem depender de barra, maiuscula/minuscula ou barra final."""
    if not caminho:
        return ""
    return os.path.normcase(os.path.normpath(caminho))


def sessao_mais_recente():
    if not os.path.exists(DB):
        log("[etiqueta] banco da SELENE nao encontrado: %s" % DB)
        return None, None
    try:
        url = "file:%s?mode=ro" % DB.replace("\\", "/")
        con = sqlite3.connect(url, uri=True, timeout=10)
        linhas = con.execute(
            "select id, title, directory from session_v2 order by time_updated desc limit 80"
        ).fetchall()
        con.close()
    except Exception as erro:
        log("[etiqueta] falha ao ler o banco: %s" % erro)
        return None, None

    alvo = normalizar(PROJETO)
    for sid, titulo, diretorio in linhas:
        if normalizar(diretorio) == alvo:
            return sid, titulo
    log("[etiqueta] nenhuma sessao desta pasta ainda")
    return None, None


def substituir(texto, chave, valor):
    """Troca a linha que comeca com `chave` sem mexer no resto do arquivo."""
    linhas = texto.splitlines()
    achou = False
    for i, linha in enumerate(linhas):
        if linha.startswith(chave):
            linhas[i] = valor
            achou = True
            break
    if not achou:
        linhas.append(valor)
    return "\n".join(linhas).rstrip("\n") + "\n"


def atualizar_etiqueta(sid):
    agora = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
    if not os.path.exists(ETIQUETA):
        log("[etiqueta] arquivo nao existe: %s" % ETIQUETA)
        return False

    with open(ETIQUETA, encoding="utf-8") as arquivo:
        texto = arquivo.read()

    if sid:
        retomar = 'RETOMAR  : cd "%s" && selene --session %s' % (PROJETO, sid)
    else:
        retomar = 'RETOMAR  : cd "%s" && selene --continue' % PROJETO

    texto = substituir(texto, "SESSAO", "SESSAO   : %s" % (sid or "-"))
    texto = substituir(texto, "RETOMAR", retomar)
    texto = substituir(texto, "ATUALIZADO", "ATUALIZADO: %s" % agora)

    with open(ETIQUETA, "w", encoding="utf-8", newline="\n") as arquivo:
        arquivo.write(texto)

    print("[etiqueta] sessao %s - atualizada em %s" % (sid or "-", agora))
    return True


def main():
    sid, titulo = sessao_mais_recente()
    if LIMPAR:
        print("[sessao] %s (%s)" % (sid or "-", titulo or "sem titulo"))
        return 0
    if sid:
        with open(ARQ_SESSAO, "w", encoding="utf-8", newline="\n") as arquivo:
            arquivo.write(sid + "\n")
        log("[sessao] %s (%s)" % (sid, titulo or "sem titulo"))
    atualizar_etiqueta(sid)
    return 0


if __name__ == "__main__":
    sys.exit(main())
