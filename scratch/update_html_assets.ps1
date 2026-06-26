# Get all HTML files in the centuary directory
$htmlFiles = Get-ChildItem -Path "$PSScriptRoot\.." -Filter *.html

Write-Host "Starting batch update of TripAdvisor, YouTube, and Header nav links..."
$updatedCount = 0

foreach ($file in $htmlFiles) {
    $filePath = $file.FullName
    $content = [System.IO.File]::ReadAllText($filePath)
    $modified = $false

    # 1. Update TripAdvisor Card
    $tripAdvisorPattern = '(?s)<div class="tripadvisor-card">.*?<\/div>'
    $tripAdvisorReplacement = @'
<div class="tripadvisor-card">
                    <img src="https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/4.5-66827-5.svg" alt="TripAdvisor">
                    <h4 data-en="Give Feedback Century-adventures" data-sw="Toa Maoni Century-adventures">Give Feedback Century-adventures</h4>
                    <p data-en="Ranked #1 on TripAdvisor" data-sw="Imeorodheshwa #1 TripAdvisor">Ranked #1 on TripAdvisor</p>
                    <a href="https://www.tripadvisor.com/" target="_blank" class="btn btn-small" data-en="TripAdvisor Give Feedback Century-adventures" data-sw="TripAdvisor Toa Maoni Century-adventures">TripAdvisor Give Feedback Century-adventures</a>
                </div>
'@
    if ($content -match $tripAdvisorPattern) {
        $content = [regex]::Replace($content, $tripAdvisorPattern, $tripAdvisorReplacement)
        $modified = $true
    }

    # 2. Connect YouTube link in footer social links
    # Match any <a href="#"><i class="fab fa-youtube"></i></a>
    $youtubePattern = '(?i)<a\s+href="#"\s*><i\s+class="fab\s+fa-youtube"\s*></i></a>'
    $youtubeReplacement = '<a href="https://www.youtube.com/@CenturyAdventures" target="_blank"><i class="fab fa-youtube"></i></a>'
    if ($content -match $youtubePattern) {
        $content = [regex]::Replace($content, $youtubePattern, $youtubeReplacement)
        $modified = $true
    }

    # 3. Update Header Navigation Link for safaris.html to "TOURS & SAFARIS"
    # Find any header link matching: <li><a href="safaris.html"...>...</a></li>
    $safarisPattern = '(?si)<li><a\s+href="safaris.html"([^>]*)>([\s\S]*?)</a></li>'
    
    # Custom evaluator keeps the "active" class if present
    $evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
        param($match)
        $attrs = $match.Groups[1].Value
        if ($attrs -match 'active') {
            return '<li><a href="safaris.html" class="active" data-en="TOURS & SAFARIS" data-sw="SAFARI NA ZIARA">TOURS & SAFARIS</a></li>'
        } else {
            return '<li><a href="safaris.html" data-en="TOURS & SAFARIS" data-sw="SAFARI NA ZIARA">TOURS & SAFARIS</a></li>'
        }
    }
    
    if ($content -match $safarisPattern) {
        $content = [regex]::Replace($content, $safarisPattern, $evaluator)
        $modified = $true
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($filePath, $content)
        Write-Host "Updated: $($file.Name)"
        $updatedCount++
    }
}

Write-Host "Batch update finished. Total files updated: $updatedCount"
