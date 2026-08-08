# OraDent Dental Clinic Landing Page

A complete, responsive, single-page landing page built for OraDent Dental Clinic in Islamabad. This project uses a strict plain static file architecture with no build steps or dependencies.

## Folder Structure

```
dental-clinic/
├── index.html        # Main single-page application (all sections)
├── css/
│   └── style.css     # Custom styles and brand variables
├── js/
│   └── script.js     # Vanilla JavaScript (interactions, form validation)
├── assets/           # Local SVG graphics, UI icons, and avatars
│   ├── logo.svg
│   ├── hero-banner.svg
│   ├── blog-placeholder.svg
│   ├── doctors/      # Initials-based avatar SVGs
│   └── icons/        # UI and social media SVG icons
└── README.md
```

## How to Run Locally

This project requires zero build steps and uses no framework (no React, Next.js, or Vue). It is 100% plain HTML, CSS, and vanilla JS.

1. **Option A (Simplest):**
   Double-click `index.html` to open it directly in your web browser.

2. **Option B (Local Server):**
   Use an extension like VS Code **Live Server** to run the site with hot-reloading, or run a simple Python HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

## Deployment

Because this project is strictly static, you can deploy it instantly to Vercel, Netlify, or GitHub Pages without configuring any build commands. Simply connect your repository and deploy the root directory.
