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

## ✅ **Current Status**

- [x] Local dev: Dockerized Django backend
- [x] Local dev: Vite/React frontend using `.env.development` and `.env.production`
- [x] PostgreSQL on AWS RDS, working with local and App Runner
- [x] Django secrets managed via AWS Secrets Manager
- [x] App Runner deployed with Docker image from ECR
- [x] Health check handled with patched ALLOWED_HOSTS logic
- [x] Static files collected in Docker, pending S3 setup
- [x] All management/command scripts identified and checked
- [x] Checklist up to date as of 2025-08-07

---

## 🟡 **Production Readiness & To-Do Checklist**

### 📦 1. **Add S3 static/media file storage**

- [ ] Use **django-storages** + S3 for:
  - [ ] Static files in production
  - [ ] User-uploaded files (if any)
  - [ ] **checksum file** used by `import_arc` management command
  - [ ] Document access/usage of these files in both code and deployment

---

### 🔒 2. **Lock down your Secrets Manager policy**

- [ ] Ensure **only App Runner** (and CI/CD) can access secrets
- [ ] Remove access from other IAM users
- [ ] Periodically rotate secrets

---

### 🛡 3. **Enable HTTPS (via custom domain in App Runner)**

- [ ] Hook up `catholicmentalprayer.com` and `meditationwithchrist.com`
  - [ ] In **App Runner → Custom domain**
  - [ ] In **Route 53 → Alias to App Runner service**
- [ ] Add both domains to Django `ALLOWED_HOSTS`
- [ ] Test with SSL

---

### 📈 4. **Add monitoring/logging**

- [ ] Use **CloudWatch Logs** for:
  - [ ] App Runner logs (stdout/stderr)
  - [ ] Django error logging
- [ ] Enable App Runner auto-scaling
- [ ] Add alerts for health check failures

---

### 🛠 5. **Consider Infrastructure as Code (IaC)**

- [ ] Plan migration to **CloudFormation** and/or **Terraform**
  - [ ] Automate all AWS resources: RDS, ECR, App Runner, S3, IAM, Secrets, Route53, etc.
  - [ ] Enable easy, repeatable production/dev/test stack creation

---

### 🔄 6. **Database Security**

- [ ] **Lock down RDS**: Only App Runner (and optionally your IP) can connect
- [ ] Remove public access to RDS
- [ ] Ensure SSL is enforced on all DB connections

---

### 🗂 7. **CI/CD and Automated Deployments**

- [ ] Add **GitHub Actions** (or AWS CodePipeline) for:
  - [ ] Docker image build/push to ECR
  - [ ] App Runner deploys on push to main
  - [ ] Environment variable/secrets sync (but never push secrets to GitHub!)

---

### 📝 8. **import_arc & Data Import Commands**

- [ ] Document/automate how to run `import_arc` on production
  - [ ] Use one-off App Runner jobs or management commands via admin shell, SSM, or CLI
  - [ ] Ensure all files used (including **checksum file**) are available (S3)
- [ ] Add a "run data import" action to CI/CD or as a custom admin operation if needed

---

### 🏷 9. **Checklist: ALLOWED_HOSTS / CORS / CSRF**

- [x] Dev: Only localhost/127.0.0.1/etc
- [x] Prod: All your domains, App Runner hostname, and no wildcards
- [ ] No * in production!
- [ ] Document and restrict to known hosts

---

## 🔗 **Notes & Further Enhancements**

- **App Runner**: Health checks should be pointed to `/admin/login/` or `/api/health/` (create if not present)
- **Checksum File**: Should be moved to S3 bucket, code should read from/write to S3
- **Static/media**: S3 for all persistent user or app data; do **not** store in container
- **Secret rotation**: Regularly rotate DB and Django keys in Secrets Manager
- **Monitoring**: Add error alerting via CloudWatch or a third-party system
- **Documentation**: Keep this checklist up to date with progress

---

## ✅ **Recently Completed**

- [x] Dockerfile cleaned and production ready
- [x] RDS PostgreSQL migrated and restricted
- [x] App Runner builds from ECR image with env vars from Secrets Manager
- [x] Patched ALLOWED_HOSTS for App Runner IP health checks
- [x] Frontend build/config set for VITE_API_URL, etc

---

# 🚀 **Next Steps**

1. S3 for static, media, and import checksum files
2. Harden RDS and Secrets Manager
3. Add custom domains with HTTPS via App Runner + Route 53
4. Add CI/CD via GitHub Actions
5. Migrate to IaC (CloudFormation/Terraform)
6. Add health check endpoint for App Runner

---

## **Questions to Resolve**

- [ ] How to best automate/deliver one-off management commands (import_arc, etc) in production?
- [ ] How to handle custom import/checksum workflow with files in S3 (access, auth, etc)?
- [ ] When/how to rotate secrets and DB creds safely?
- [ ] What IAM roles need to exist for App Runner/CI/CD?

---
