$files = @("katavi.html", "selous.html", "ruaha.html", "mikumi.html", "serengeti.html", "gombe.html", "ngorongoro.html", "manyara.html", "tarangire.html")
$baseDir = "c:\Users\messi\OneDrive\Desktop\kai-Projets-main\kai-Projets-main\centuary"

foreach ($file in $files) {
    $path = Join-Path $baseDir $file
    if (-not (Test-Path $path)) {
        Write-Host "Skipping ${file} - not found"
        continue
    }
    Write-Host "Processing ${file}..."
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # Replace CTA Paragraph
    $ctaTarget = 'Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. Let Century Adventures turn those dreams into reality.'
    if ($content.Contains($ctaTarget)) {
        # Regular expression to match the paragraph containing the target text
        $regex = '(?s)<p style="max-width: 650px;.*?Imagine witnessing a lion hunt.*?Let Century Adventures turn those dreams into reality\..*?</p>'
        $replacement = '<p class="cta-description" style="max-width: 650px; margin: 0 auto 25px; font-size:0.9rem; line-height: 1.65; opacity: 0.9;">
                <span class="cta-hide-mobile" data-en="Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. " data-sw="Fikiria kushuhudia uwindaji wa simba wakati wa mapambazuko, kutazama tembo wakizurura kwa uhuru kwenye savanna zisizo na mwisho, kujionea Uhamiaji Mkuu, au kupumzika kwenye mchanga mweupe wa Zanzibar. ">Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. </span>
                <span data-en="Let Century Adventures turn those dreams into reality." data-sw="Ruhusu Century Adventures kugeuza ndoto hizo kuwa kweli.">Let Century Adventures turn those dreams into reality.</span>
            </p>'
        $content = [regex]::Replace($content, $regex, $replacement)
    }

    # Replace Footer link cols
    $content = $content.Replace('<div class="footer-col link-col">', '<div class="footer-col link-col collapsible">')

    # Replace Tip Cards paragraphs
    $tipRegex = '(?s)<div class="tip-card[^"]*">.*?</div>'
    $content = [regex]::Replace($content, $tipRegex, {
        param($match)
        $card = $match.Value
        return [regex]::Replace($card, '<p(?!\s+class=)', '<p class="tip-text"')
    })

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done processing ${file}"
}
Write-Host "All files processed successfully!"
