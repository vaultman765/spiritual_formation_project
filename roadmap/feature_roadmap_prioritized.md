
# ✅ Mental Prayer Project – PRIORITIZED Feature Roadmap

This roadmap tracks every known and proposed feature, prioritized for structured rollout.  
We will check off boxes as items are completed to stay on task and aligned.

---

## 🥇 PHASE 1 – Core Experience Polish & Completion (🔥 High Priority)

### 🔐 Account System – Hybrid Auth Strategy (Phase 1 Now, Phase 2 Later)

#### Phase 1: Email + Password Auth (Immediate)

- [x] `/api/register/` – backend view for account creation
- [x] `/api/login/` – backend session login
- [x] `/api/logout/` – session logout route
- [x] Enable CSRF + session middleware (DRF)
- [x] Create registration form on frontend
- [x] Update `LoginPage.tsx` to use real login (remove mock)
- [x] Add user greeting / status in nav bar
- [x] Protect journey endpoints with login-required

#### Phase 2: Google OAuth (Optional Later)

- [ ] Add `django-allauth` or `dj-rest-auth`
- [ ] Setup Google client ID + secret
- [ ] Add “Sign in with Google” button to login/register
- [ ] Auto-link or create `User` object on first login

### 🔨 Journey Core Features

- [x] 🧍‍♂️ Build real user registration + login (DRF session-based)
- [x] 🔐 Decide between username/password, Google OAuth, or both
- [x] 🏠 Show “your next and next-next day” on homepage if logged in

- [ ] ✅ Mark day complete → auto-advance journey `currentDay`
- [ ] 🔁 Skip day / arc functionality in `/my-journey`
- [ ] 🔄 Reorder arcs **after journey creation**
- [ ] ➕ Add arc to existing journey (custom only)
- [ ] 🗑️ Remove arc from existing journey
- [ ] ✅ Journey deletion & overwrite logic (already in place)
- [ ] 🧭 Visual journey progress tracker (e.g. arc chips or bar)

### 🎨 UI Polish and UX Improvements

- [ ] ✨ Final spacing + hover polish on `/create-custom-journey`
- [ ] 📱 Improve `/my-journey` layout (mobile & desktop UX)
- [ ] 💅 `/explore` layout + tag filter UX polish
- [ ] 📌 Bookmark/favorite arcs (user list of saved arcs)

### 🧘 Day Page Enhancements

- [ ] ✅ Prev / Next day nav logic
- [ ] ✅ Toggle for `Resolution` section
- [ ] 🏷️ Show tags on meditation day pages
- [ ] 📝 Add user notepad per day (saved reflection field)

---

## 🥈 PHASE 2 – New Pages + Reading System (🚀 Near-Term)

### 🗂 Pages to Build

- [ ] `/tags` — Tag index, definitions, linked arcs/days
- [ ] `/how-to-pray` — Ignatian method guide
- [ ] `/readings` — Full reading index and metadata
- [ ] `/prebuilt-journeys` — Static journey plans
- [ ] 🗓 Liturgical Calendar navigation UI

### 📘 Reading Plan Integration

- [ ] Finalize `book_index.yaml` structure
- [ ] Add tag/book pairing logic to YAMLs
- [ ] Add recommended readings to arc pages
- [ ] Enable filter/search of arcs by companion reading

---

## 🥉 PHASE 3 – Backend Extensions & Auth

### 🔐 DRF + Backend Improvements

- [ ] Add register + login + logout routes
- [ ] UserMeditationProgress model → track completed days
- [ ] `/api/days/:id/mark-complete/` endpoint
- [ ] Add personal reflection note field to day model

### 🏷️ Tag System Expansion

- [ ] Hover tooltip with tag description
- [ ] Tag → Arc usage count view
- [ ] New API: `/api/tags/full/` with tag metadata
- [ ] Advanced tag filtering (multiple tag combos)

---

## 🧱 PHASE 4 – Content + YAML System

### 📦 Meditation System Enhancements

- [ ] Begin Arc 13 (*Luminous Mysteries*)
- [ ] Begin Arc 14 (*Angelus*)
- [ ] Validate YAML batch with `day_full_schema.yaml`
- [ ] Update or regenerate arc tag files if missing
- [ ] Automate checklist YAML on new day creation

---

## 🧰 PHASE 5 – DevOps & Infrastructure

### 🐳 AWS Hosting (Draft Plan)

- [ ] ✅ Dockerize Django backend (prep for ECS/Fargate)
- [ ] Deploy Vite/React frontend to S3 + CloudFront
- [ ] Store YAMLs in S3 (public read, protected write)
- [ ] Use RDS for PostgreSQL (managed)
- [ ] Load balancing via ALB
- [ ] Optional: API Gateway + Lambda expansions
- [ ] Add GitHub Action to deploy stack

### ⚙️ Developer Experience

- [ ] CLI: `import_day_yaml.py`, `load_arc_metadata()`
- [ ] GitHub Action: validate YAML schema on commit
- [ ] Add tests for serializers + views
- [ ] Add README / Dev setup + routes doc

---

## 🧠 Long-Term & Optional Features

- [ ] Audio playback for meditations
- [ ] Theme switch (dark/light mode)
- [ ] PDF downloads of meditations
- [ ] “Streaks” or daily reminder system
- [ ] Suggested arcs based on journey progress
- [ ] Multi-user journeys (group use)
- [ ] Admin dashboard for editing arcs/days

---

Last updated: 2025-07-12
