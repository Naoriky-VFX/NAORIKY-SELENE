"""Faz backup consistente do banco de sessoes da SELENE em bats/backups/.

Por que API de backup do SQLite e nao copia de arquivo:
o banco roda em modo WAL. Copiar selene.db com o app aberto pode gerar um
arquivo corrompido ou desatualizado. A API `Connection.backup()` tira uma foto
consistente mesmo com o SELENE escrevendo.

Uso:
    python bats\\backup-sessao.py              # backup + rotacao
    python bats\\backup-sessao.py --manter 5   # guarda os 5 mais recentes
    python bats\\backup-sessao.py --listar     # so mostra o que existe

Rotacao: os mais antigos vao para a LIXEIRA (nunca apagados em definitivo).

ATENCAO: bats/backups/ esta no .gitignore. O banco tem historico de conversa e
a tabela `credential` -- NUNCA pode ir para o repositorio (que e publico).
"""

import datetime
import os
import sqlite3
import subprocess
import sys

PROJETO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
ORIGEM = os.path.join(os.path.expanduser("~"), ".local", "share", "selene", "selene.db")
PASTA = os.path.join(PROJETO, "bats", "backups")
MANTER_PADRAO = 10


def parametro(nome, padrao):
    if nome in sys.argv:
        i = sys.argv.index(nome)
        if i + 1 < len(sys.argv):
            try:
                return int(sys.argv[i + 1])
            except ValueError:
                pass
    return padrao


def listar():
    if not os.path.isdir(PASTA):
        print("[backup] nenhum backup ainda")
        return
    arquivos = sorted(f for f in os.listdir(PASTA) if f.endswith(".db"))
    total = 0
    for nome in arquivos:
        mb = os.path.getsize(os.path.join(PASTA, nome)) / (1024 * 1024)
        total += mb
        print("  %-34s %7.1f MB" % (nome, mb))
    print("  %d backup(s) - %.1f MB" % (len(arquivos), total))


def backup(manter):
    if not os.path.exists(ORIGEM):
        print("[backup] banco nao encontrado: %s" % ORIGEM)
        return 1

    os.makedirs(PASTA, exist_ok=True)
    selo = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    destino = os.path.join(PASTA, "selene-%s.db" % selo)

    try:
        url = "file:%s?mode=ro" % ORIGEM.replace("\\", "/")
        src = sqlite3.connect(url, uri=True, timeout=30)
        dst = sqlite3.connect(destino)
        src.backup(dst)
        dst.execute("PRAGMA journal_mode=DELETE")  # backup fica autocontido
        ok = dst.execute("PRAGMA integrity_check").fetchone()[0]
        sessoes = dst.execute("select count(*) from session_v2").fetchone()[0]
        mensagens = dst.execute("select count(*) from session_message").fetchone()[0]
        dst.close()
        src.close()
    except Exception as erro:
        print("[backup] FALHOU: %s" % erro)
        if os.path.exists(destino):
            os.remove(destino)
        return 1

    mb = os.path.getsize(destino) / (1024 * 1024)
    print("[backup] %s" % os.path.basename(destino))
    print("[backup] %.1f MB | integridade=%s | %d sessoes | %d mensagens" % (mb, ok, sessoes, mensagens))
    if ok != "ok":
        print("[backup] ATENCAO: integridade diferente de 'ok' - guarde e avise")

    rotacionar(manter)
    return 0


def rotacionar(manter):
    arquivos = sorted(f for f in os.listdir(PASTA) if f.endswith(".db"))
    antigos = arquivos[:-manter] if manter > 0 and len(arquivos) > manter else []
    for nome in antigos:
        caminho = os.path.join(PASTA, nome).replace("'", "''")
        try:
            subprocess.run(
                [
                    "powershell",
                    "-NoProfile",
                    "-Command",
                    "Add-Type -AssemblyName Microsoft.VisualBasic; "
                    "[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('%s','OnlyErrorDialogs','SendToRecycleBin')"
                    % caminho,
                ],
                check=False,
                capture_output=True,
                timeout=60,
            )
            print("[backup] rotacao: %s -> Lixeira" % nome)
        except Exception as erro:
            print("[backup] rotacao falhou em %s: %s" % (nome, erro))


def main():
    if "--listar" in sys.argv:
        listar()
        return 0
    return backup(parametro("--manter", MANTER_PADRAO))


if __name__ == "__main__":
    sys.exit(main())
