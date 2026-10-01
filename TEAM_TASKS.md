# Wishly — Team Tasks & Integration Board

> Single source of truth for module ownership, implementation state and final integration.

## 1. Team Structure

| Module | GitHub | Ownership |
|---|---|---|
| M1 | `Ayush-Agrawal673` | Motion / Public Wish Page / Templates |
| M2 | `Aryan-222005` | Creator Frontend / Wizard / Dashboard |
| M3 | `Ayushibansal805` | Backend / Authentication / APIs / Data Layer |
| M4 | `ayushagrawalgla` | Media / Cloudinary |
| M5 | `Ayushi536` | DevOps / Integration / QA / Documentation |

---

## 2. Branch Strategy

```text
main  ← final release
  ↑
dev   ← integration branch
  ↑
feature/m1-templates
feature/m2-wizard
feature/m3-backend
feature/m4-media
feature/m5-devops
```

### Integration rule

Every module is developed on its feature branch, integrated into `dev`, validated there, then promoted from `dev` to `main`.

---

## 3. Module Status

### M1 — Public Wish Page / Templates

**Owner:** `Ayush-Agrawal673`

- [x] Wishly public experience foundation
- [x] Public wish page UI foundation
- [x] Template / visual foundation
- [x] Feature branch merged into `dev`
- [x] Integrated into `main`

### M2 — Creator Frontend

**Owner:** `Aryan-222005`

- [x] Creator frontend foundation
- [x] Dashboard foundation
- [x] Creation flow
- [x] Review flow
- [x] Feature branch merged into `dev`
- [x] Integrated into `main`

### M3 — Backend / Auth / Data

**Owner:** `Ayushibansal805`

- [x] Auth API surface
- [x] User/session handling
- [x] Page CRUD API surface
- [x] AI API routes
- [x] Admin API surface
- [x] Current data-layer implementation
- [x] Feature branch merged into `dev`
- [x] Integrated into `main`

### M4 — Media / Cloudinary

**Owner:** `ayushagrawalgla`

- [x] Cloudinary configuration
- [x] Upload API
- [x] Cloudinary package / lockfile update
- [x] Feature branch merged into `dev`
- [x] Integrated into `main`

> GitHub account used for the M4 commits is `ayushagrawalgla`.

### M5 — DevOps / QA / Documentation

**Owner:** `Ayushi536`

- [x] Repository / branch coordination
- [x] `.env.example` baseline
- [x] Integration from `origin/dev` into M5 branch
- [x] GitHub Actions CI workflow
- [x] Correct M5 commit identity
- [x] M5 branch merged into `dev`
- [x] `dev` merged into `main`
- [x] Local `main` synced with `origin/main`
- [ ] Execute final end-to-end QA matrix
- [ ] Verify production deployment
- [ ] Add live URL and demo video
- [ ] Final README polish after live verification

---

## 4. CI Workflow

**File:** `.github/workflows/ci.yml`

Current quality flow:

```text
Checkout
   ↓
Setup Bun
   ↓
bun install --frozen-lockfile
   ↓
bun run lint
   ↓
bun run build
```

Triggers include pushes to `dev`, `main` and feature branches, plus pull requests into `dev` / `main`.

---

## 5. Git Integration Record

### M5 branch

The final M5 CI commit was authored with the M5 identity:

```text
Ayushi536 <ayu704sharma32@gmail.com>
```

### Integration path

```text
feature/m5-devops
      ↓
      dev
      ↓
      main
```

The final repository was checked locally with:

```text
git status
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

---

## 6. Final QA Matrix

### Authentication

- [ ] Signup with valid values
- [ ] Login with valid credentials
- [ ] Reject invalid credentials
- [ ] Logout
- [ ] `/api/auth/me` reflects session state

### Creator flow

- [ ] Open dashboard
- [ ] Create page
- [ ] Add / edit page content
- [ ] Select template
- [ ] Upload media
- [ ] Review page
- [ ] Publish / open public URL

### Public experience

- [ ] Open `/w/[slug]`
- [ ] Verify all core sections render
- [ ] Submit a guest wish
- [ ] Trigger candle interaction
- [ ] Refresh and verify persistence

### AI

- [ ] Generate wish through UI
- [ ] Handle missing / invalid AI input
- [ ] Verify server-side handling of provider secrets

### Admin

- [ ] Open admin area with admin account
- [ ] Verify protected access behavior

### Build / CI

- [ ] `bun install --frozen-lockfile`
- [ ] `bun run lint`
- [ ] `bun run build`
- [ ] GitHub Actions run checked

### Deployment

- [ ] Production env variables configured
- [ ] Production build succeeds
- [ ] Live URL opens
- [ ] Cloudinary upload works in deployment
- [ ] Public wish URL works in deployment

---

## 7. Submission Checklist

- [x] GitHub repository public
- [x] `main` integrated
- [x] Feature modules merged
- [x] CI workflow committed
- [x] README / SPEC / TEAM_TASKS / PROMPTS present
- [ ] Live URL added
- [ ] Demo video added
- [ ] Final QA completed
- [ ] Submission form updated with final links
