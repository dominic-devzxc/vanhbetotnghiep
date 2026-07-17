# 🏗️ Infrastructure & Docker Standards

## 📂 Environment Mapping
- **Local**: `docker-compose.yml` (Hot-reload, Dev-tools)
- **Production**: `docker-compose.prod.yml` (Standalone, Hardened)
- **Vercel Production**: Next.js zero-config từ branch `main`; Docker vẫn là build/test gate local.
- **Beta/Staging**: [None - Create only on request]

## 🔒 Security Protocol
- Use `.env.example` for all sensitive variables.
- Production images use Alpine/Slim versions.
- Firewall rules: Only expose mapped ports 89XX.
- Vercel environment bắt buộc: `NEXT_PUBLIC_SITE_URL`, `GOOGLE_APPS_SCRIPT_URL`; `RSVP_DRY_RUN=false` ở Production.
