$excludeList = @(
    "katavi.html", "selous.html", "ruaha.html", "mikumi.html", "serengeti.html", 
    "gombe.html", "ngorongoro.html", "manyara.html", "tarangire.html",
    "safaris.html", "experiences.html", "volunteer.html", "vehicles.html", 
    "contact.html", "index.html", "about.html", "admin-dashboard.html", "dashboard.html"
)

$baseDir = "c:\Users\messi\OneDrive\Desktop\kai-Projets-main\kai-Projets-main\centuary"
$htmlFiles = Get-ChildItem -Path $baseDir -Filter *.html

foreach ($fileItem in $htmlFiles) {
    $fileName = $fileItem.Name
    if ($excludeList -contains $fileName) {
        Write-Host "Skipping ${fileName} (in exclude list)"
        continue
    }
    
    $path = $fileItem.FullName
    Write-Host "Processing ${fileName}..."
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $modified = $false

    # Replace CTA Paragraph Variation A (sunrise/reality)
    $regexA = '(?s)<p style="max-width: 650px;.*?Imagine witnessing a lion hunt at sunrise.*?dreams into reality.*?</p>'
    $replacementA = '<p class="cta-description" style="max-width: 650px; margin: 0 auto 25px; font-size:0.9rem; line-height: 1.65; opacity: 0.9;">
                <span class="cta-hide-mobile" data-en="Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. " data-sw="Fikiria kushuhudia uwindaji wa simba wakati wa mapambazuko, kutazama tembo wakizurura kwa uhuru kwenye savanna zisizo na mwisho, kujionea Uhamiaji Mkuu, au kupumzika kwenye mchanga mweupe wa Zanzibar. ">Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. </span>
                <span data-en="Let Century Adventures turn those dreams into reality." data-sw="Ruhusu Century Adventures kugeuza ndoto hizo kuwa kweli.">Let Century Adventures turn those dreams into reality.</span>
            </p>'

    # Replace CTA Paragraph Variation B (dawn/come true)
    $regexB = '(?s)<p style="max-width: 650px;.*?Imagine witnessing a lion hunt at dawn.*?make those dreams come true.*?</p>'
    $replacementB = '<p class="cta-description" style="max-width: 650px; margin: 0 auto 25px; font-size:0.9rem; line-height: 1.65; opacity: 0.9;">
                <span class="cta-hide-mobile" data-en="Imagine witnessing a lion hunt at dawn, watching elephants roam freely across the endless savannah, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. " data-sw="Fikiria kushuhudia uwindaji wa simba wakati wa machweo, kutazama tembo wakizurura kwa uhuru kwenye savanna zisizo na mwisho, kujionea Uhamiaji Mkuu, au kupumzika kwenye mchanga mweupe wa Zanzibar. ">Imagine witnessing a lion hunt at dawn, watching elephants roam freely across the endless savannah, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. </span>
                <span data-en="Let Century Adventures make those dreams come true." data-sw="Ruhusu Century Adventures kufanya ndoto hizo ziwe kweli.">Let Century Adventures make those dreams come true.</span>
            </p>'

    if ($content -match 'Imagine witnessing a lion hunt.*?sunrise') {
        $content = [regex]::Replace($content, $regexA, $replacementA)
        Write-Host "  -> Replaced CTA Variation A (sunrise)"
        $modified = $true
    } elseif ($content -match 'Imagine witnessing a lion hunt.*?dawn') {
        $content = [regex]::Replace($content, $regexB, $replacementB)
        Write-Host "  -> Replaced CTA Variation B (dawn)"
        $modified = $true
    }

    # Replace Footer link cols
    if ($content.Contains('<div class="footer-col link-col">')) {
        $content = $content.Replace('<div class="footer-col link-col">', '<div class="footer-col link-col collapsible">')
        Write-Host "  -> Made footer link columns collapsible"
        $modified = $true
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  -> Done saving changes to ${fileName}"
    } else {
        Write-Host "  -> No changes needed for ${fileName}"
    }
}
Write-Host "All remaining files processed successfully!"
