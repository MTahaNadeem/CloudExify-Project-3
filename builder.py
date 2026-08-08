import re
import os

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update logo and hero
html = html.replace('<a class="navbar-brand" href="#">SmileCare</a>', '<a class="navbar-brand" href="#"><img src="assets/logo.svg" alt="OraDent Logo" height="40"></a>')
html = html.replace('<div class="footer-brand">SmileCare</div>', '<div class="footer-brand mb-3"><img src="assets/logo.svg" alt="OraDent Logo" height="40"></div>')

hero_pattern = r'<img src="https://images.unsplash.com[^>]*>'
html = re.sub(hero_pattern, '<img src="assets/hero-banner.svg" alt="OraDent Clinic" class="img-fluid rounded-4 shadow-lg" width="600" height="400">', html, count=1)

# 2. Update Social Links
social_html = '''<a href="https://www.facebook.com/people/OraDent-Dental-Clinic/61550781995358/" target="_blank" rel="noopener noreferrer" class="social-btn"><img src="assets/icons/facebook.svg" width="20" height="20" alt="Facebook"></a>
                        <a href="https://www.instagram.com/oradentdentalclinici8/" target="_blank" rel="noopener noreferrer" class="social-btn"><img src="assets/icons/instagram.svg" width="20" height="20" alt="Instagram"></a>
                        <a href="https://www.google.com/search?q=OraDent+Dental+Clinic#reviews" target="_blank" rel="noopener noreferrer" class="social-btn"><img src="assets/icons/google.svg" width="20" height="20" alt="Google Reviews"></a>'''
# Replace the block of 3 social buttons
social_block_pattern = r'<a href="#" class="social-btn"><i class="fab fa-facebook-f"></i></a>[\s\S]*?<a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>'
html = re.sub(social_block_pattern, social_html, html)

# 3. Update WhatsApp Links
wa_i8_pattern = r'<a href="[^"]*" class="btn btn-outline-primary btn-sm rounded-pill px-4 mt-2">Chat on WhatsApp</a>'
html = re.sub(wa_i8_pattern, '<a href="https://wa.me/923249134745" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm rounded-pill px-4 mt-2"><img src="assets/icons/whatsapp.svg" width="16" height="16" class="me-1">Chat on WhatsApp</a>', html, count=1)
# Second one is F-8
html = re.sub(wa_i8_pattern, '<a href="https://wa.me/923065393039" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm rounded-pill px-4 mt-2"><img src="assets/icons/whatsapp.svg" width="16" height="16" class="me-1">Chat on WhatsApp</a>', html, count=1)

# 4. Doctor Avatars
def get_initials(name):
    name = name.replace('Dr. ', '')
    parts = name.split()
    return ''.join([p[0].upper() for p in parts[:2]])

def doc_replace(match):
    name = match.group(1).strip()
    initials = get_initials(name)
    fname = f"{initials.lower()}-avatar.svg"
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#e0f2fe"/><text x="50" y="65" font-family="Inter, sans-serif" font-size="40" font-weight="bold" fill="#0c4a6e" text-anchor="middle">{initials}</text></svg>"""
    with open(f"assets/doctors/{fname}", 'w', encoding='utf-8') as f: f.write(svg)
    return f'<img src="assets/doctors/{fname}" class="img-fluid rounded-circle shadow-sm mb-3" style="width: 80px; height: 80px;" alt="{name}">'

# The placeholder in the HTML is `<div class="doctor-placeholder-img"></div>` just before `<h6 class="fw-bold mb-1">Dr. X Y</h6>`
html = re.sub(r'<div class="doctor-placeholder-img"></div>\s*<h6 class="fw-bold mb-1">([^<]+)</h6>', lambda m: doc_replace(m) + f'\n                        <h6 class="fw-bold mb-1">{m.group(1)}</h6>', html)

# 5. Blog placeholders
blog_ph = r'<div class="geometric-placeholder"[^>]*></div>'
html = re.sub(blog_ph, '<img src="assets/blog-placeholder.svg" class="img-fluid w-100" style="height: 180px; object-fit: cover;" alt="Blog image">', html)

# 6. Icons mappings (replace <i class="..."> with <img src="assets/icons/X.svg">)
icon_map = {
    'fa-tooth': 'tooth', 'fa-smile': 'smile', 'fa-screwdriver-wrench': 'wrench',
    'fa-bars': 'list', 'fa-star': 'star', 'fa-teeth': 'teeth', 'fa-syringe': 'syringe',
    'fa-fill': 'fill', 'fa-check-circle': 'check-circle', 'fa-phone-alt': 'phone',
    'fa-map-marker-alt': 'map-pin', 'fa-phone': 'phone', 'fa-whatsapp': 'whatsapp',
    'fa-clock': 'clock', 'fa-calendar-check': 'calendar', 'fa-shield-alt': 'shield',
    'fa-user-md': 'user-md', 'fa-arrow-up': 'arrow-up', 'fa-arrow-right': 'arrow-right'
}

def replace_icon(match):
    full = match.group(0)
    classes = match.group(1)
    
    # identify icon name
    icon_name = 'default'
    for c in classes.split():
        if c in icon_map:
            icon_name = icon_map[c]
            break
            
    # Keep other classes (e.g. fa-2x, text-primary, fs-1)
    other_classes = [c for c in classes.split() if not c.startswith('fa-') and c != 'fas' and c != 'fab' and c != 'fa-2x']
    # If it had fa-2x, maybe add some size
    size = 24
    if 'fa-2x' in classes or 'fs-1' in classes: size = 48
    
    class_str = ' '.join(other_classes)
    class_attr = f' class="{class_str}"' if class_str else ''
    
    # Generate generic SVG
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" stroke-width="16"/><text x="128" y="140" font-size="24" text-anchor="middle">{icon_name}</text></svg>"""
    # Or instead of generic text, I will just write a very generic shape.
    
    with open(f"assets/icons/{icon_name}.svg", 'w', encoding='utf-8') as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="#0c4a6e" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>')
        
    return f'<img src="assets/icons/{icon_name}.svg" width="{size}" height="{size}"{class_attr} alt="{icon_name}">'

html = re.sub(r'<i class="([^"]*)"></i>', replace_icon, html)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

print("Replacements completed.")
