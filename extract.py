import re
import os

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

# 1 & 2. Logo replacements
html = html.replace('<a class="navbar-brand" href="#">OraDent</a>', '<a class="navbar-brand" href="#"><img src="assets/logo.svg" alt="OraDent Logo" height="40"></a>')
html = html.replace('<div class="footer-brand">OraDent</div>', '<div class="footer-brand mb-3"><img src="assets/logo.svg" alt="OraDent Logo" height="40"></div>')

# 3. Hero banner
hero_svg_pattern = r'<svg viewBox="0 0 600 400"[\s\S]*?</svg>'
html = re.sub(hero_svg_pattern, '<img src="assets/hero-banner.svg" alt="OraDent Clinic" class="img-fluid rounded-4 shadow-lg w-100">', html, count=1)

# 4. Blog placeholders
blog_pattern = r'<div class="d-flex align-items-center justify-content-center bg-light" style="height: 180px; width: 100%; border-bottom: 1px solid rgba\(0,0,0,0\.05\);">\s*<svg[\s\S]*?</svg>\s*</div>'
html = re.sub(blog_pattern, '<img src="assets/blog-placeholder.svg" class="img-fluid w-100" style="height: 180px; object-fit: cover;" alt="Blog Placeholder">', html)

# 5. Doctor avatars
os.makedirs('assets/doctors', exist_ok=True)
def replace_doctor(match):
    full_match = match.group(0)
    initials = match.group(1).strip()
    
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="#f0f9ff"/>
    <text x="50" y="65" font-family="Inter, sans-serif" font-size="40" font-weight="bold" fill="#0c4a6e" text-anchor="middle">{initials}</text>
</svg>"""
    
    filename = f"{initials.lower()}-avatar.svg"
    with open(f"assets/doctors/{filename}", 'w', encoding='utf-8') as f:
        f.write(svg_content)
        
    return f'<img src="assets/doctors/{filename}" class="mb-3 mx-auto shadow-sm rounded-circle" style="width: 80px; height: 80px;" alt="Dr. {initials}">'

doc_pattern = r'<div class="doctor-avatar mb-3 mx-auto d-flex align-items-center justify-content-center fw-bold text-primary"[^>]*>([^<]+)</div>'
html = re.sub(doc_pattern, replace_doctor, html)

# 6. Remaining UI Icons
os.makedirs('assets/icons', exist_ok=True)
icon_counter = 1

def replace_ui_icon(match):
    global icon_counter
    full_svg = match.group(0)
    
    # Extract class attribute to retain it on the img
    class_match = re.search(r'class="([^"]*)"', full_svg)
    classes = class_match.group(1) if class_match else ""
    
    # Extract width/height or style to keep sizing
    style_match = re.search(r'style="([^"]*)"', full_svg)
    style = style_match.group(1) if style_match else ""
    
    width_match = re.search(r'width="([^"]*)"', full_svg)
    width = width_match.group(1) if width_match else ""
    
    filename = f"icon-{icon_counter}.svg"
    with open(f"assets/icons/{filename}", 'w', encoding='utf-8') as f:
        f.write(full_svg)
        
    icon_counter += 1
    
    style_attr = f' style="{style}"' if style else ''
    width_attr = f' width="{width}"' if width else ''
    # For SVGs pretending to be icons, setting height to auto or matching width is good
    height_attr = f' height="{width}"' if width else ''
    
    # Some SVGs use 'currentColor' which doesn't work in <img> tag, but we can't easily change it if we don't know the exact color.
    # However, since they were Phosphor icons, most use fill="currentColor".
    # Wait, <img> tags cannot inherit currentColor! I need to replace "currentColor" with "#0c4a6e" (brand primary) or "#6c757d" (muted).
    # Most icons in the site are primary or white. I will just replace currentColor with #0c4a6e for all icons, 
    # except if they are in social buttons where they should be #ffffff or something.
    
    if 'social-btn' in classes or 'text-white' in classes:
        full_svg_colored = full_svg.replace('currentColor', '#ffffff')
    else:
        full_svg_colored = full_svg.replace('currentColor', '#0c4a6e')
        
    with open(f"assets/icons/{filename}", 'w', encoding='utf-8') as f:
        f.write(full_svg_colored)
        
    return f'<img src="assets/icons/{filename}" class="{classes}"{style_attr}{width_attr}{height_attr} alt="icon">'

html = re.sub(r'<svg[\s\S]*?</svg>', replace_ui_icon, html)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Extracted {icon_counter - 1} UI icons and fully updated index.html.")
