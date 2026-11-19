# Gedaa Restaurant — Digital Menu & Restaurant Management

A secure, full-stack QR digital menu and restaurant management system branded for **GEDAA RESTAURANT** featuring the sacred **Oromo Gadaa Symbol** as its official emblem.

---

## 🌟 Access Portals

| Portal | URL | Purpose |
| :--- | :--- | :--- |
| **📱 Gedaa Digital QR Menu** | **[http://localhost:3000/](http://localhost:3000/)** | Customer-facing mobile menu displaying the Oromo Gadaa logo, tri-lingual support (English, Afaan Oromoo, Amharic), categories, dish catalog, and table ordering. |
| **⚙️ Gedaa Admin Portal** | **[http://localhost:3000/admin](http://localhost:3000/admin)** | Staff & Manager portal: Complete food customizer (names, photos, categories, prices, badges), live POS station, kitchen tickets (KDS), waiter calls, and table QR codes. |

---

## 🔒 Security Configuration & Staff Authentication

The system has been hardened following enterprise security standards:
- **Staff Authentication**: Secure PIN protection with brute-force rate-limiting (configurable via environment variable `GEDAA_ADMIN_PIN`).
- **Session Tokens**: Cryptographically random 24-byte tokens (`X-Admin-Token` header) with 24-hour expiration.
- **Database Protection**: Direct HTTP access to `hotel_menu.db`, `.py`, `.bat`, `.env`, and sensitive files is strictly blocked (HTTP 403 / 404).
- **Zero Client Price Tampering**: Order subtotals, 10% service charge, 15% VAT, and totals are computed strictly server-side using verified database pricing.
- **Upload Hardening**: File uploads are strictly validated by binary magic bytes (only authentic JPEG, PNG, WebP, GIF), capped at 5MB, and protected against directory traversal.
- **XSS Sanitization**: Dynamic user/database content is sanitized via `escapeHtml()` and `sanitizeUrl()`.
- **Security Headers**: Deployed with CSP (Content-Security-Policy), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy`.

---

## 🚀 Netlify Deployment Guide

1. **Frontend Hosting**:
   The frontend is configured for instant Netlify deployment via [`netlify.toml`](file:///c:/Users/HP/Desktop/HOTEL%20MENU%20DIGITAL/netlify.toml).
   - Netlify serves `index.html`, `admin.html`, `styles.css`, `app.js`, and `gedaa_logo.svg` over its global CDN.
   - All HTTP security headers (CSP, HSTS, frame options) and sensitive file redirect blocks are automated in `netlify.toml`.

2. **Backend Architecture on Netlify**:
   - Because Netlify CDN is static and serverless (read-only filesystem without continuous Python runtime), host `server.py` on a persistent Python container host (e.g. Render, Railway, Fly.io, or your local restaurant mini-PC).
   - If hosting backend separately, configure your custom backend URL in `app.js` or set a Netlify rewrite proxy rule:
     ```toml
     [[redirects]]
       from = "/api/*"
       to = "https://your-backend-api.example.com/api/:splat"
       status = 200
       force = true
     ```

---

## 🌳 The Oromo Gadaa Symbol Logo

The official logo ([`gedaa_logo.svg`](file:///c:/Users/HP/Desktop/HOTEL%20MENU%20DIGITAL/gedaa_logo.svg)) incorporates:
- **The Sacred Odaa Tree** (*Ficus sycomorus*), the historic symbol of democratic assembly, peace, and unity under the Gadaa system.
- **The Authentic Gadaa Tri-Colors**:
  - **Gurraacha (Black)**: The creator Waaqa and the mysterious future.
  - **Diimaa (Red)**: Life, courage, sacrifice, and the active present.
  - **Adii (White)**: Ancestors, peace, truth, and purity.
- **Gold Embellishments & Arched Emblem**: "GEDAA RESTAURANT" text on the lower crest with red star badges.
