import os
import re

# List of target destination files
files = [
    "katavi.html",
    "selous.html",
    "ruaha.html",
    "mikumi.html",
    "serengeti.html",
    "gombe.html",
    "ngorongoro.html",
    "manyara.html",
    "tarangire.html"
]

base_dir = r"c:\Users\messi\OneDrive\Desktop\kai-Projets-main\kai-Projets-main\centuary"

cta_original = re.compile(
    r'<p style="max-width:\s*650px;\s*margin:\s*0\s+auto\s+25px;\s*font-size:\s*0\.9rem;\s*line-height:\s*1\.65;\s*opacity:\s*0\.9;"\s+'
    r'data-en="Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar\. Let Century Adventures turn those dreams into reality\."\s+'
    r'data-sw="Fikiria kushuhudia uwindaji wa simba wakati wa mapambazuko, kutazama tembo wakizurura kwa uhuru kwenye savanna zisizo na mwisho, kujionea Uhamiaji Mkuu, au kupumzika kwenye mchanga mweupe wa Zanzibar\. Ruhusu Century Adventures kugeuza ndoto hizo kuwa kweli\.">'
    r'\s*Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar\. Let Century Adventures turn those dreams into reality\.'
    r'\s*</p>',
    re.DOTALL
)

cta_replacement = """<p class="cta-description" style="max-width: 650px; margin: 0 auto 25px; font-size:0.9rem; line-height: 1.65; opacity: 0.9;">
                <span class="cta-hide-mobile" data-en="Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. " data-sw="Fikiria kushuhudia uwindaji wa simba wakati wa mapambazuko, kutazama tembo wakizurura kwa uhuru kwenye savanna zisizo na mwisho, kujionea Uhamiaji Mkuu, au kupumzika kwenye mchanga mweupe wa Zanzibar. ">Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. </span>
                <span data-en="Let Century Adventures turn those dreams into reality." data-sw="Ruhusu Century Adventures kugeuza ndoto hizo kuwa kweli.">Let Century Adventures turn those dreams into reality.</span>
            </p>"""

def process_tip_cards(content):
    # Match any <div class="tip-card ..."> up to its closing </div>
    # To handle nesting, we match non-greedy but make sure it includes the tip-card block.
    # Note: Destination tip-cards do not contain other div elements except tip-icon. So matching until the next tip-card or section close is safe.
    tip_card_pattern = re.compile(r'(<div class="tip-card[^"]*">.*?</div>)', re.DOTALL)
    
    def replace_p(match):
        card_content = match.group(1)
        # Replace <p with <p class="tip-text" if class is not present
        replaced = re.sub(r'<p(?!\s+class=)', r'<p class="tip-text"', card_content)
        return replaced

    return tip_card_pattern.sub(replace_p, content)

for filename in files:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename}: file not found")
        continue
        
    print(f"Processing {filename}...")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replacement 1: CTA Paragraph
    original_len = len(content)
    content = cta_original.sub(cta_replacement, content)
    if len(content) == original_len:
         # Try a fallback simple replace just in case formatting slightly differs
         simple_target = 'Imagine witnessing a lion hunt at sunrise, watching elephants roam freely across endless savannahs, experiencing the Great Migration, or relaxing on the white sands of Zanzibar. Let Century Adventures turn those dreams into reality.'
         if simple_target in content:
             print(f"  CTA exact match failed, performing fallback substitution on {filename}")
             # Locate paragraph container and swap it
             p_pattern = re.compile(r'<p style="max-width: 650px;.*?' + re.escape(simple_target) + r'.*?</p>', re.DOTALL)
             content = p_pattern.sub(cta_replacement, content)
             
    # Replacement 2: Footer collapsible columns
    # Replaces <div class="footer-col link-col"> with <div class="footer-col link-col collapsible">
    content = content.replace('<div class="footer-col link-col">', '<div class="footer-col link-col collapsible">')
    
    # Replacement 3: Tip cards paragraph tagging
    content = process_tip_cards(content)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Done processing {filename}")

print("All destination files processed successfully!")
