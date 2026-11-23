# Exports public/Tegar-Maulana-Portfolio.pptx to PDF with PowerPoint (Windows, PowerPoint installed).
# Run after `npm run resume`: npm run resume:pdf
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$pptx = Join-Path $root 'public\Tegar-Maulana-Portfolio.pptx'
$pdf = Join-Path $root 'public\Tegar-Maulana-Portfolio.pdf'

$app = New-Object -ComObject PowerPoint.Application
try {
    # ReadOnly, Untitled, WithWindow off
    $deck = $app.Presentations.Open($pptx, $true, $false, $false)
    $deck.SaveAs($pdf, 32) # 32 = ppSaveAsPDF; hyperlinks stay clickable
    $deck.Close()
    Write-Output "wrote $pdf"
} finally {
    $app.Quit()
}
