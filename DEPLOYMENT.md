# 🚀 Mental Prayer Project – Deployment Guide

This guide outlines how to deploy the full-stack Mental Prayer Project, which includes:

- 🧠 Django + DRF backend (in `/website/`)
- 🖼 Vite + React frontend (in `/frontend/`)
- 📜 YAML-based spiritual formation metadata (in `/metadata/`, `/reading_plan/`, etc.)

---

## 1️⃣ Local Development

### Backend:
```bash
python manage.py runserver
```

> Or use the Makefile: `make run`

### Frontend:
```bash
cd frontend/
npm install
npm npm run dev -- --host
```

---

## 2️⃣ Local Production Build

### Build frontend:
```bash
cd frontend/
npm run build
```

This outputs to `/frontend/dist/`. You can:

- Serve this folder via nginx
- Copy it to Django static folder (if integrating directly)

---

## 3️⃣ Docker (Optional, Recommended for Cloud)

Create a `docker-compose.yml` with:
```yaml
services:
  backend:
    build: ./website
    command: gunicorn app.wsgi:application
    ports: ["8000:8000"]
  frontend:
    build: ./frontend
    command: serve -s dist
    ports: ["3000:3000"]
```

> Replace with your actual folder names or Dockerfiles.

---

## 4️⃣ AWS Deployment Plan

### Frontend:
- Host on **S3** (static site)
- Serve via **CloudFront** (global CDN + HTTPS)

### Backend:
- Deploy with **Fargate (ECS)** or **EC2**
- Use **Gunicorn + Django** behind an **Application Load Balancer**
- Use **.env** or **SSM Parameters** for secrets

### Data:
- Store YAML files on **S3** (optional)
- Or bake into image and load via mounted `/metadata/` folder

---

## 5️⃣ Secrets and `.env` Setup (Future)

Later, use:
- `python-decouple` or `os.environ.get(...)` for settings
- Separate `.env` files:
  - `.env.dev`
  - `.env.prod`

---

## 6️⃣ GitHub Actions (Future Ideas)

```yaml
# .github/workflows/deploy.yml
on: [push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate YAML
        run: python scripts/validate_metadata.py
```

You could also:
- Deploy frontend to S3 on push
- Deploy backend to EC2/Fargate on tag

---

## 7️⃣ Database Notes

- ✅ SQLite is fine for dev
- 🔁 Swap for Postgres in production
- ⛔ Do not expose SQLite to the web

---

## ✅ Deployment Phase Summary

| Phase | Action |
|-------|--------|
| Dev ✅ | Use Vite + Django runserver |
| Build ✅ | Run `vite build` |
| Ship 🚀 | Push frontend to S3 + CloudFront, backend to ECS or EC2 |
| Scale 🔒 | Add HTTPS, env separation, proper logging and monitoring |

---

Made with ❤️ by the Mental Prayer Project