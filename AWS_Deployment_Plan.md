# Spiritual Formation Project – AWS Deployment & CI/CD Plan

**Last updated:** 2025-08-06  
**Maintainer:** [Your Name]

---

## 🚀 Overview

This document describes how to deploy the
[spiritual_formation_project](https://github.com/vaultman765/spiritual_formation_project)
(Vite/React frontend + Django backend + occasional metadata scripts) to AWS, using a modern, cost-effective, and secure approach.

---

## 🏗️ Reference Architecture

| Component              | AWS Service            | Purpose                                  |
|------------------------|------------------------|-------------------------------------------|
| Frontend (React/Vite)  | S3 + CloudFront        | Static website hosting + CDN              |
| Backend (Django API)   | AWS App Runner         | Managed container, easy scaling           |
| Database               | RDS PostgreSQL         | Managed, reliable, Django ORM compatible  |
| Secrets/Config         | Secrets Manager (or SSM)| Secure env/secrets management            |
| Metadata Scripts       | Local for now / Lambda | Manual run for now; Lambda for automation |
| CI/CD                  | GitHub Actions         | Build/test/deploy automation              |

---

## 🔑 Security & Secrets

- All secrets (e.g., Django `SECRET_KEY`, DB credentials) are out of source code and loaded via environment variables.
- Local `.env` is used for development and ignored by git.
- Production secrets/config will be stored in AWS Secrets Manager or SSM Parameter Store and injected into AWS services.

---

## 🗂️ Folder Structure

```plaintext
/spiritual_formation_project
  /frontend # Vite + React frontend (static)
  /website # Django backend (API, admin, DB)
  /scripts # Metadata/DB loader scripts (run manually)
  /metadata # Ignatian mental prayer metadata
```

---

## 🏗️ Deployment Steps & Status

### 1. **Backend (Django API)**

#### **Current Progress:**

- [x] Dockerized Django app (`website` folder)
- [x] PostgreSQL used for local/Docker backend (no SQLite)
- [x] Environment-based settings and secret separation for dev/prod
- [x] Local CORS configured for frontend
- [x] Can run locally and via Docker

#### **Production-Ready Checklist:**

- [x] AWS RDS (Postgres) created, automated backups enabled
- [ ] RDS public access set to **No**; security group allows only AWS app, not global access
- [ ] Store all secrets (`DB_PASSWORD`, `SECRET_KEY`, etc) in AWS Secrets Manager (or as env vars in App Runner for MVP)
- [ ] DEBUG=False and ALLOWED_HOSTS set to your public domain(s) (e.g., `api.catholicmentalprayer.com`)
- [ ] CORS/CSRF set for your frontend domain (`https://catholicmentalprayer.com`)
- [ ] S3 used for `STATIC_ROOT` & Django static files; update `STATIC_URL`
- [ ] Logging settings for errors
- [ ] Build & push backend Docker image to ECR
- [ ] Deploy Django backend to AWS App Runner (using ECR image and RDS connection)
- [ ] Test: admin login, user login, saving data, static file load

---

### 2. **Frontend (React/Vite)**

#### **Current Progress:**

- [x] Frontend builds to static files using Vite
- [x] API calls use `import.meta.env.VITE_API_URL`
- [x] `.env.production` points to backend API URL

#### **Production-Ready Checklist:**

- [ ] `npm run build` and upload `/dist` to S3 bucket (public-read)
- [ ] Configure CloudFront to serve S3 with HTTPS + custom domain
- [ ] Test site: API requests use backend (`VITE_API_URL`)
- [ ] Set up S3 website hosting for redirect domain (`meditationwithchrist.com`)
- [ ] (If needed) Set CORS on S3 if you run into browser errors

---

### 3. **DNS / Domains**

- [ ] Use Route 53 (or your DNS) to point domains to:
  - CloudFront for frontend (`catholicmentalprayer.com`)
  - App Runner for API backend (`api.catholicmentalprayer.com`)
- [ ] Set up redirect for `meditationwithchrist.com` (S3 or Route 53)

---

### 4. **Security**

- [x] RDS in AWS (not local), backups on
- [ ] RDS security group: not public, only accessible by App Runner/ECS
- [ ] App Runner exposes only HTTP/HTTPS (API)
- [ ] No secrets in git or code (use env vars or AWS Secrets Manager)
- [ ] HTTPS/SSL via CloudFront and App Runner

---

### 5. **CI/CD (Optional, but Recommended)**

- [ ] GitHub Actions for backend: build Docker, push to ECR, trigger App Runner deploy
- [ ] GitHub Actions for frontend: build, sync to S3

---

## 🏁 **Launch Steps**

1. Finalize RDS security (lock down security group, no public access)
2. Build Docker image, push to ECR, deploy to App Runner, configure env vars (DB, SECRET_KEY, ALLOWED_HOSTS, etc)
3. Set up Django static files to use S3 (`collectstatic`)
4. Build and upload frontend to S3, configure CloudFront for HTTPS
5. Set up domains and DNS (Route 53)
6. Test site as a user (frontend → backend → database flow)
7. Announce your launch!

---

## 📚 References

- [Deploying Django on App Runner](https://aws.amazon.com/blogs/containers/deploy-and-scale-django-applications-on-aws-app-runner/)
- [Hosting Vite/React on S3 + CloudFront](https://dev.to/aws-builders/deploy-your-react-app-on-aws-s3-cloudfront-30eo)
- [Django environment variable config](https://django-environ.readthedocs.io/en/latest/)
- [AWS Secrets Manager pricing](https://aws.amazon.com/secrets-manager/pricing/)

---

**Questions? Contact:** [Your Email]

---

## **Quick-Action: Your Next Step**
>
> **Backend:** Build Docker image → Push to ECR → Deploy to App Runner (connect to RDS, set env vars)
> **Frontend:** Build → Upload to S3 → Configure CloudFront  
> **DNS:** Update Route 53
> **Security:** Lock down RDS

---
