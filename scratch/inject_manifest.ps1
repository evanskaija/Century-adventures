$directory = $PSScriptRoot
$parentDir = Split-Path -Parent $directory
$manifestLink = "    <link rel=`"manifest`" href=`"manifest.json`">"

Get-ChildItem -Path $parentDir -Filter *.html | ForEach-Object {
    $filePath = $_.FullName
    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    
    if ($content -notmatch 'href="manifest\.json"' -and $content -notmatch 'href="\./manifest\.json"') {
        if ($content -match '</head>') {
            # Replace case-insensitively
            $newContent = $content -replace '(?i)</head>', "$manifestLink`r`n</head>"
            [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Injected manifest link into $($_.Name)"
        } else {
            Write-Warning "No </head> found in $($_.Name)"
        }
    }
}
Write-Host "Completed manifest injection."
