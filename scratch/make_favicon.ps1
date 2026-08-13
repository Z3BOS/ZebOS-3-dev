Add-Type -AssemblyName System.Drawing

$width = 64
$height = 64
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

# Black Rounded Rectangle Background
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$rect = New-Object System.Drawing.Rectangle(2, 2, 60, 60)
$r = 16

$path.AddArc($rect.X, $rect.Y, $r, $r, 180, 90)
$path.AddArc(($rect.Right - $r), $rect.Y, $r, $r, 270, 90)
$path.AddArc(($rect.Right - $r), ($rect.Bottom - $r), $r, $r, 0, 90)
$path.AddArc($rect.X, ($rect.Bottom - $r), $r, $r, 90, 90)
$path.CloseFigure()

$blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$g.FillPath($blackBrush, $path)

# Thick Crisp White Z Logo
$whitePen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 7)
$whitePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$whitePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$whitePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

$p1 = New-Object System.Drawing.Point(14, 14)
$p2 = New-Object System.Drawing.Point(50, 14)
$p3 = New-Object System.Drawing.Point(14, 50)
$p4 = New-Object System.Drawing.Point(50, 50)

$points = [System.Drawing.Point[]]@($p1, $p2, $p3, $p4)
$g.DrawLines($whitePen, $points)

$g.Dispose()

# Save PNG Files
$bmp.Save("C:\Users\HarisAbidX\Documents\GitHub\ZEB Repos\ZebOS-3-dev\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)

$assetsDir = "C:\Users\HarisAbidX\Documents\GitHub\ZEB Repos\ZebOS-3-dev\assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir
}
$bmp.Save("C:\Users\HarisAbidX\Documents\GitHub\ZEB Repos\ZebOS-3-dev\assets\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
Write-Host "Favicon PNG successfully created!"
