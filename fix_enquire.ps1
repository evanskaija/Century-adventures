# Read file as UTF-8
$filePath = "d:\my projects\centuary\enquire.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Fix mangled em-dashes: â€" -> —
$badEmDash = [char]0x00E2 + [string][char]0x20AC + [string]([char]0x201C)
$content = $content.Replace($badEmDash, [string]([char]0x2014))

# Also try the common pattern: Â\u00e2\u0080\u0093 etc.
# Try simple string replacement for â€"
$content = $content.Replace("â€"", "—")

# Fix mangled ðŸ"© -> 📩 (U+1F4E9)
$envelope = [char]::ConvertFromUtf32(0x1F4E9)
$content = $content.Replace("ðŸ""©", $envelope)

# Fix mangled ðŸŒðŸ¦âœ¨ -> 🌍🦁✨
$globe = [char]::ConvertFromUtf32(0x1F30D)
$lion = [char]::ConvertFromUtf32(0x1F981)
$sparkles = [string]([char]0x2728)
$goodEmojis = $globe + $lion + $sparkles

# Try various mangled patterns
$content = $content.Replace("ðŸŒðŸ¦âœ¨", $goodEmojis)

# Write back as UTF-8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)

Write-Host "Done! Checking for remaining issues..."

# Verify
$verify = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
if ($verify.Contains("â€"")) { Write-Host "WARNING: Still has mangled em-dash" } else { Write-Host "OK: No mangled em-dash found" }
if ($verify.Contains("ðŸ""©")) { Write-Host "WARNING: Still has mangled envelope" } else { Write-Host "OK: No mangled envelope found" }
if ($verify.Contains("ðŸŒ")) { Write-Host "WARNING: Still has mangled globe" } else { Write-Host "OK: No mangled globe found" }
