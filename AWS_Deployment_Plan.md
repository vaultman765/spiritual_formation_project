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
- [x]  import_arc working locally and against RDS
- [x] Design approved: single S3 checksum is the production source of truth

---

## 🟡 **Production Readiness & To-Do Checklist**

### 📦 1. **Add S3 static/media file storage**

- [ ] Use **django-storages** + S3 for:
  - [x] Static files in production
  - [x] User-uploaded files (if any) - N/A
  - [x] Single checksum file in S3: s3://spiritual-formation-prod/checksum/.mental_prayer_checksums.json
  - [ ] Document S3 paths and lifecycle rules (optional)

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

### 🛠 5. **Consider Infrastructure as Code (IaC) IMPORTANT**

- [ ] Plan migration to **CloudFormation** and/or **Terraform**
  - [ ] Terraform/CloudFormation modules for: RDS, ECR, App Runner, S3, IAM, Secrets, Route53, EventBridge, Lambda/ECS, everything!
  - [ ] Reproducible staging/prod environments

---

### 🔄 6. **Database Security**

- [ ] Restrict RDS to App Runner + admin IP(s)
- [ ] Remove public access to RDS
- [ ] Ensure SSL is enforced on all DB connections

---

### 🗂 7. **CI/CD and Automated Deployments**

- [ ] Add **GitHub Actions** (or AWS CodePipeline) for:
  - [ ] Docker image build/push to ECR
  - [ ] Trigger App Runner deploy on merge to main
  - [ ] Sync metadata/** to S3 on merge (see pipeline below)
  - [ ] Environment variable/secrets sync (but never push secrets to GitHub!)

---

### 📝 8. **import_arc & Data Import Commands**

#### Desired End-State Workflow:

##### Dev changes arc YAML in repo (/metadata/**).

##### PR → code review → merge to main.

##### GitHub Actions:

- Build and push backend image to ECR  
- Upload updated YAML to S3 (`metadata/**`)

##### EventBridge rule watches S3 ObjectCreated in metadata/ and triggers a one-off import job

```bash
python manage.py import_arc --arc-id <id-or-all> --skip-unchanged
```

The job:

- Reads checksum JSON from S3
- Imports only changed days/arcs to RDS
- Writes updated checksum JSON back to S3
- Updates first line of each changed YAML with Last imported into DB: <ts> (writes to S3)
  
##### Everything is hands-off; no manual RDS/S3 sync needed.

---

### 🏷 9. **Checklist: ALLOWED_HOSTS / CORS / CSRF**

- [x] Dev: Only localhost/127.0.0.1/etc
- [x] Prod: All your domains, App Runner hostname, and no wildcards
- [ ] No * in production!
- [ ] Document and restrict to known hosts

---

## 🔗 **Notes & Further Enhancements**

- **App Runner**: Health checks should be pointed to `/admin/login/` or `/api/health/` (create if not present)

- **Checksum File**:
  - Prod: Single source of truth is S3 (checksum/.mental_prayer_checksums.json).
  - Dev: Local file is fine; production jobs never rely on it.
- **Import job IAM role needs**:
  - s3:GetObject, s3:PutObject, s3:ListBucket on spiritual-formation-prod/metadata/** and checksum/.mental_prayer_checksums.json
  - secretsmanager:GetSecretValue for DB/SECRET_KEY
  - (If ECS) VPC access to RDS (subnets + SG)
- **Secret rotation**: Regularly rotate DB and Django keys in Secrets Manager
- **Monitoring**: Add error alerting via CloudWatch or a third-party system
- **Documentation**: Keep this checklist up to date with progress
- Avoid writing persistent data to container filesystems.
- Optionally add pre-signed URLs if manual S3 inspection is needed.
- Future: split import_arc into subcommands for more granular reprocessing.

---

## ✅ **Recently Completed**

- [x] Reverted S3/local hybrid changes that broke imports
- [x] Restored working local + RDS imports
- [x] Finalized S3‑only checksum design for prod
- [x] Patched ALLOWED_HOSTS for App Runner IP health checks
- [x] Agreed on one‑off job pattern (Lambda/ECS) instead of trying to “exec into” App Runner

---

# 🚀 **Next Steps**

1. IaC plan - All infra/everything on AWS comes from Terraform/cdk/CloudFormation (whichever we chose).
2. Harden RDS and Secrets Manager
3. Add GitHub Actions job to sync metadata/** to S3 on merge.
4. Create S3 → EventBridge/GH Action → (Lambda container or ECS task) trigger to run import_arc.
5. Add custom domains with HTTPS via App Runner + Route 53
6. Enable HTTPS on custom domains.
7. Add health check endpoint for App Runner

---
