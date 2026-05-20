$port = 3000
$root = $PSScriptRoot
$url  = "http://localhost:$port/"

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.json' = 'application/json'
    '.woff2'= 'font/woff2'
}

if ($null -eq (Get-Command "New-Object" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: New-Object not found. This script must be run in PowerShell." -ForegroundColor Red
    exit
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host ""
Write-Host "  +------------------------------------------+" -ForegroundColor Cyan
Write-Host "  |   F.R.E.A.S-UNC Dev Server Running       |" -ForegroundColor Cyan
Write-Host "  |   http://localhost:$port                     |" -ForegroundColor Cyan
Write-Host "  |   Press Ctrl+C to stop                   |" -ForegroundColor Cyan
Write-Host "  +------------------------------------------+" -ForegroundColor Cyan
Write-Host ""

# Open browser
try { Start-Process "http://localhost:$port" } catch {}

try {
    while ($listener.IsListening) {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $resp = $ctx.Response

        $localPath = $req.Url.LocalPath
        if ($localPath -eq '/') { $localPath = '/index.html' }

        $normPath = $localPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $root $normPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = 'application/octet-stream'
            if ($mime.ContainsKey($ext)) { $contentType = $mime[$ext] }
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $resp.ContentType = $contentType
            $resp.ContentLength64 = $bytes.Length
            $resp.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # SPA fallback
            $idx = Join-Path $root 'index.html'
            if (Test-Path $idx) {
                $bytes = [System.IO.File]::ReadAllBytes($idx)
                $resp.ContentType = 'text/html; charset=utf-8'
                $resp.ContentLength64 = $bytes.Length
                $resp.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        }
        $resp.OutputStream.Close()
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
