# Read file as raw bytes
$filePath = "d:\my projects\centuary\enquire.html"
$bytes = [System.IO.File]::ReadAllBytes($filePath)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# Count issues before fix
$count1 = ([regex]::Matches($content, [char]0x00E2)).Count
Write-Host "Found $count1 occurrences of char 0xE2 (potential mojibake start)"

# Strategy: search and replace using Unicode code points
# The mangled em-dash sequence in UTF-8 is: C3 A2 E2 82 AC E2 80 9C  (which is "â€" when decoded as windows-1252 then re-encoded)
# But it appears in the file as the characters: â € "

# Let's just search for the exact text patterns and replace
# First, let's find what's actually in the file around "inquiry"
$idx = $content.IndexOf("inquiry")
if ($idx -gt 0) {
    $surrounding = $content.Substring($idx, [Math]::Min(80, $content.Length - $idx))
    $charCodes = $surrounding.ToCharArray() | ForEach-Object { "U+{0:X4}" -f [int]$_ }
    Write-Host "Around 'inquiry': $($charCodes -join ' ')"
}

# Find the actual character sequence around the dash
$idx2 = $content.IndexOf("inquiry ")
if ($idx2 -gt 0) {
    $snippet = $content.Substring($idx2 + 8, 10)
    $codes = $snippet.ToCharArray() | ForEach-Object { "U+{0:X4}({1})" -f [int]$_, $_ }
    Write-Host "After 'inquiry ': $($codes -join ' ')"
}

# Check for the envelope area
$idx3 = $content.IndexOf("2.5rem; margin-bottom: 15px;")
while ($idx3 -gt 0) {
    $after = $content.Substring($idx3 + 29, 30)
    $codes3 = $after.ToCharArray() | ForEach-Object { "U+{0:X4}" -f [int]$_ }
    Write-Host "After font-size div: $($codes3 -join ' ')"
    $idx3 = $content.IndexOf("2.5rem; margin-bottom: 15px;", $idx3 + 1)
}
