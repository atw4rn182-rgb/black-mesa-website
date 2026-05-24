# Regenerate assets/photos/manifest.json from all images in that folder.
# Files with "feature" in the name go in the featured section (top of gallery).

$photosDir = Join-Path $PSScriptRoot "..\assets\photos"
if (-not (Test-Path $photosDir)) {
  New-Item -ItemType Directory -Force -Path $photosDir | Out-Null
}

$featured = [System.Collections.Generic.List[string]]::new()
$normal = [System.Collections.Generic.List[string]]::new()

Get-ChildItem $photosDir -File |
  Where-Object {
    $_.Name -ne "manifest.json" -and
    $_.Extension -match "^\.(jpe?g|png|webp|gif)$"
  } |
  Sort-Object Name |
  ForEach-Object {
    $rel = "assets/photos/" + $_.Name
    if ($_.Name -match "(?i)feature") {
      $featured.Add($rel)
    } else {
      $normal.Add($rel)
    }
  }

$manifest = @{
  featured = $featured
  photos   = $normal
}

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText(
  (Join-Path $photosDir "manifest.json"),
  ($manifest | ConvertTo-Json -Depth 3),
  $utf8NoBom
)
Write-Host "Updated manifest: $($featured.Count) featured, $($normal.Count) gallery photos."
