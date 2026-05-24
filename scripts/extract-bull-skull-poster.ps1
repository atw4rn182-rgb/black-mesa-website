# Extract a poster still from the widescreen bull skull video (requires ffmpeg on PATH).
$assetsDir = Join-Path $PSScriptRoot "..\assets"
$video = Join-Path $assetsDir "bull-skull-wide.mp4"
$poster = Join-Path $assetsDir "bull-skull-poster.jpg"

if (-not (Test-Path $video)) {
  Write-Error "Missing $video"
  exit 1
}

$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue)?.Source
if (-not $ffmpeg) {
  Write-Error "ffmpeg not found. Install ffmpeg and run again."
  exit 1
}

& $ffmpeg -y -i $video -ss 00:00:00.5 -vframes 1 -q:v 2 $poster
Write-Host "Wrote $poster"
