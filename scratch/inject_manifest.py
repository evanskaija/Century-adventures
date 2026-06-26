import os
import re

def inject_manifest_to_html_files():
    directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    manifest_link = '    <link rel="manifest" href="manifest.json">'
    
    count = 0
    for filename in os.listdir(directory):
        if filename.endswith('.html'):
            filepath = os.path.join(directory, filename)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check if manifest link is already there
            if 'href="manifest.json"' in content or 'href="./manifest.json"' in content:
                continue
                
            # Find the closing </head> tag and insert manifest link right before it
            if '</head>' in content:
                new_content = content.replace('</head>', f'{manifest_link}\n</head>')
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Injected manifest link into {filename}")
                count += 1
            else:
                print(f"Warning: No </head> tag found in {filename}")
                
    print(f"Completed manifest injection. Total files modified: {count}")

if __name__ == '__main__':
    inject_manifest_to_html_files()
