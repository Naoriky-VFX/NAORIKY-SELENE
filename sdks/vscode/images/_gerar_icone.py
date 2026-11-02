from PIL import Image, ImageDraw, ImageFilter

S = 512
ROXO = (139, 92, 246)   # #8b5cf6
CIANO = (34, 211, 238)  # #22d3ee
FUNDO = (7, 7, 13)      # #07070d


def gradiente(tam, a, b):
    img = Image.new("RGB", (tam, tam))
    px = img.load()
    for y in range(tam):
        for x in range(tam):
            t = (x + y) / (2 * (tam - 1))
            px[x, y] = (
                round(a[0] + (b[0] - a[0]) * t),
                round(a[1] + (b[1] - a[1]) * t),
                round(a[2] + (b[2] - a[2]) * t),
            )
    return img


def mascara_lua(tam):
    m = Image.new("L", (tam, tam), 0)
    d = ImageDraw.Draw(m)
    escala = tam / 512
    d.ellipse([80 * escala, 80 * escala, 432 * escala, 432 * escala], fill=255)
    d.ellipse([170 * escala, 64 * escala, 470 * escala, 364 * escala], fill=0)
    return m


def estrela(d, cx, cy, r, cor, alpha=255):
    d.polygon(
        [(cx, cy - r), (cx + r * 0.28, cy - r * 0.28), (cx + r, cy),
         (cx + r * 0.28, cy + r * 0.28), (cx, cy + r), (cx - r * 0.28, cy + r * 0.28),
         (cx - r, cy), (cx - r * 0.28, cy - r * 0.28)],
        fill=cor + (alpha,),
    )


# --- icone da extensao: quadrado arredondado escuro + lua em gradiente ---
base = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(base)
d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=FUNDO + (255,))

lua = mascara_lua(S)

# brilho suave atras da lua
brilho = Image.new("RGBA", (S, S), (0, 0, 0, 0))
brilho.paste(ROXO + (150,), (0, 0), lua.filter(ImageFilter.GaussianBlur(26)))
base = Image.alpha_composite(base, brilho)

# a lua com o gradiente roxo -> ciano
corpo = gradiente(S, ROXO, CIANO).convert("RGBA")
base.paste(corpo, (0, 0), lua)

# estrelinhas
est = Image.new("RGBA", (S, S), (0, 0, 0, 0))
de = ImageDraw.Draw(est)
estrela(de, 372, 130, 26, (241, 242, 250), 235)
estrela(de, 424, 196, 15, CIANO, 220)
estrela(de, 340, 372, 12, (241, 242, 250), 180)
base = Image.alpha_composite(base, est)

base.save(r"images/icon.png")
base.resize((256, 256), Image.LANCZOS).save(r"images/icon-256.png")
print("icon.png gerado:", base.size)
