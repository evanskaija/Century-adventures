$files = @("safaris.html", "experiences.html", "volunteer.html", "vehicles.html", "contact.html", "index.html")
$baseDir = "c:\Users\messi\OneDrive\Desktop\kai-Projets-main\kai-Projets-main\centuary"

foreach ($file in $files) {
    $path = Join-Path $baseDir $file
    if (-not (Test-Path $path)) {
        Write-Host "Skipping ${file} - not found"
        continue
    }
    Write-Host "Processing ${file}..."
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # Replace CTA Paragraph (Dawn/Savannah text version)
    $regex = '(?s)<p style="max-width: 650px;.*?Imagine witnessing a lion hunt at dawn.*?make those dreams come true.*?</p>'
    $replacement = '<p class="cta-description" style="max-width: 650px; margin: 0 auto 25px; font-size:0.9rem; line-height: 1.65; opacity: 0.9;">
                <span class="cta-hide-mobile" data-en="Imagine witnessing a lion hunt at dawn, watching elephants roam freely across the endless savannah, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. " data-sw="Fikiria kushuhudia uwindaji wa simba wakati wa machweo, kutazama tembo wakizurura kwa uhuru kwenye savanna zisizo na mwisho, kujionea Uhamiaji Mkuu, au kupumzika kwenye mchanga mweupe wa Zanzibar. ">Imagine witnessing a lion hunt at dawn, watching elephants roam freely across the endless savannah, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. </span>
                <span data-en="Let Century Adventures make those dreams come true." data-sw="Ruhusu Century Adventures kufanya ndoto hizo ziwe kweli.">Let Century Adventures make those dreams come true.</span>
            </p>'
            
    if ($content -match 'Imagine witnessing a lion hunt') {
        $content = [regex]::Replace($content, $regex, $replacement)
        Write-Host "Replaced CTA in ${file}"
    }

    # Replace Footer link cols
    if ($content.Contains('<div class="footer-col link-col">')) {
        $content = $content.Replace('<div class="footer-col link-col">', '<div class="footer-col link-col collapsible">')
        Write-Host "Replaced footer link columns in ${file}"
    }

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done processing ${file}"
}
Write-Host "All files processed successfully!"
