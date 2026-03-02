# Deployment & Custom Domain Setup

This project is a static website (`index.html`, `styles.css`, `script.js`) and is ready for zero-build deployment.

## Option 1: GitHub Pages (already configured in this repo)

A workflow is included at:
- `.github/workflows/deploy-pages.yml`

### Steps
1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set **Source = GitHub Actions**.
4. Push to your deployment branch (`main` or `work`) to trigger deployment.
5. The workflow will publish the site and provide the Pages URL.

---

## Custom Domain on GitHub Pages

### 1) Add your domain in GitHub
1. Go to **Settings → Pages → Custom domain**.
2. Enter your domain (example: `thepharmafile.com` or `www.thepharmafile.com`).
3. Save.

### 2) Configure DNS records

#### For apex/root domain (e.g., `thepharmafile.com`)
Use A records:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

#### For subdomain (e.g., `www.thepharmafile.com`)
Use CNAME:
- `www` → `<your-github-username>.github.io`

### 3) Enable HTTPS
- In **Settings → Pages**, enable **Enforce HTTPS** once certificate provisioning is complete.

### 4) (Optional but recommended) Add a CNAME file
Create a `CNAME` file in the repository root containing only your domain, e.g.:

```txt
www.thepharmafile.com
```

---

## Option 2: Netlify (no build)
1. Create a new site from Git repository.
2. Build command: *(leave empty)*
3. Publish directory: `.`
4. Add custom domain in **Site settings → Domain management**.

## Option 3: Vercel (no build)
1. Import the repository in Vercel.
2. Framework preset: **Other**.
3. Build command: *(empty)*, Output directory: `.`
4. Add custom domain in **Project → Settings → Domains**.

---

## Quick verification after deployment
- Open site URL and verify all sections load.
- Check 3D model viewer initializes.
- Test protocol generator and equipment search.
- Test on mobile viewport.
