# Gera a orb da SELENE (sem texto) em PNG, legivel em 16px.
# Uso: powershell -ExecutionPolicy Bypass -File _gerar-orb.ps1
Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot "orb.png"
$size = 64
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

# brilho externo
$glow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 150, 90, 255))
$g.FillEllipse($glow, 0, 0, 64, 64)

# base da orb
$base = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 43, 24, 82))
$g.FillEllipse($base, 3, 3, 58, 58)

# gradiente radial aproximado por circulos concentricos
$steps = 40
for ($i = $steps; $i -ge 1; $i--) {
    $t = $i / $steps
    $r = [int](27 * $t)
    $a = [int](70 * (1 - $t) + 10)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($a, 158, 108, 255))
    $g.FillEllipse($brush, (32 - $r), (32 - $r), ($r * 2), ($r * 2))
    $brush.Dispose()
}

# anel de contorno
$ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(235, 178, 126, 255), 2.2)
$g.DrawEllipse($ringPen, 4.2, 4.2, 55.6, 55.6)

# crescente (disco A menos o disco B)
$pathA = New-Object System.Drawing.Drawing2D.GraphicsPath
$pathA.AddEllipse(17, 17, 30, 30)
$pathB = New-Object System.Drawing.Drawing2D.GraphicsPath
$pathB.AddEllipse(26, 13, 30, 30)
$moon = New-Object System.Drawing.Region($pathA)
$moon.Exclude($pathB)
$moonBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 233, 220, 255))
$g.FillRegion($moonBrush, $moon)

# estrela de quatro pontas
$star = New-Object System.Drawing.Drawing2D.GraphicsPath
$star.AddPolygon(@(
    (New-Object System.Drawing.PointF(45.5, 14)),
    (New-Object System.Drawing.PointF(47.1, 18)),
    (New-Object System.Drawing.PointF(51, 19.6)),
    (New-Object System.Drawing.PointF(47.1, 21.2)),
    (New-Object System.Drawing.PointF(45.5, 25.2)),
    (New-Object System.Drawing.PointF(43.9, 21.2)),
    (New-Object System.Drawing.PointF(40, 19.6)),
    (New-Object System.Drawing.PointF(43.9, 18))
))
$g.FillPath($moonBrush, $star)

# estrelinha menor
$star2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$star2.AddPolygon(@(
    (New-Object System.Drawing.PointF(16.5, 40)),
    (New-Object System.Drawing.PointF(17.6, 42.9)),
    (New-Object System.Drawing.PointF(20.5, 44)),
    (New-Object System.Drawing.PointF(17.6, 45.1)),
    (New-Object System.Drawing.PointF(16.5, 48)),
    (New-Object System.Drawing.PointF(15.4, 45.1)),
    (New-Object System.Drawing.PointF(12.5, 44)),
    (New-Object System.Drawing.PointF(15.4, 42.9))
))
$g.FillPath($moonBrush, $star2)

$g.Dispose()
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

# variante com selo "+" (usada no botao de nova aba)
$g2 = [System.Drawing.Graphics]::FromImage($bmp)
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 22, 14, 44))
$badgeRing = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 201, 169, 255), 2.4)
$g2.FillEllipse($badgeBg, 34, 34, 28, 28)
$g2.DrawEllipse($badgeRing, 34, 34, 28, 28)
$plusBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 239, 230, 255))
$g2.FillRectangle($plusBrush, 39.5, 46.2, 17, 3.6)
$g2.FillRectangle($plusBrush, 46.2, 39.5, 3.6, 17)
$g2.Dispose()
$bmp.Save((Join-Path $PSScriptRoot "orb-plus.png"), [System.Drawing.Imaging.ImageFormat]::Png)


# previa ampliada (so para conferencia visual, nao entra no pacote)
$big = New-Object System.Drawing.Bitmap(256, 256)
$gb = [System.Drawing.Graphics]::FromImage($big)
$gb.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$gb.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$gb.DrawImage($bmp, 0, 0, 256, 256)
$gb.Dispose()
$big.Save((Join-Path $env:TEMP "opencode\orb-preview.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$big.Dispose()

$bmp.Dispose()
Write-Output "gerado: $out"
