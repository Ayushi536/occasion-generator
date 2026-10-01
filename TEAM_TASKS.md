# TEAM TASKS — LIVE EXAM BOARD

> Update this file after meaningful work. This is the team's live source of truth.

## Current Phase

**Phase:** 0 — Plan / Foundation

**Last Updated:** TBD

---

## Team Members

| Member | Name | Branch | Ownership | Status |
|---|---|---|---|---|
| M1 | TBD | feature/m1-templates | Motion / Public Page / Templates | 🟡 |
| M2 | TBD | feature/m2-wizard | Frontend / Wizard / Dashboard | 🟡 |
| M3 | TBD | feature/m3-backend | Backend / DB / Auth / APIs | 🟡 |
| M4 | TBD | feature/m4-media | Media / Cloudinary / Sharing | 🟡 |
| M5 | TBD | feature/m5-devops | DevOps / QA / Docs | 🟡 |

---

# P0 MASTER CHECKLIST

## Auth
- [ ] Signup
- [ ] Login
- [ ] Logout
- [ ] Protected dashboard
- [ ] Seeded admin

## Wizard
- [ ] Occasion
- [ ] Recipient
- [ ] Words
- [ ] Language
- [ ] Media
- [ ] Style
- [ ] Review
- [ ] Validation
- [ ] Generate

## Language
- [ ] English
- [ ] Hinglish
- [ ] Hindi
- [ ] Devanagari font

## Media
- [ ] Cloudinary
- [ ] Up to 15 images
- [ ] Up to 2 videos
- [ ] Register media

## Templates
- [ ] Template 1
- [ ] Template 2
- [ ] Template 3

## Generation
- [ ] Unique slug
- [ ] Stored page
- [ ] Public URL

## Sharing
- [ ] Copy link
- [ ] QR
- [ ] WhatsApp/share

## Generated Page
- [ ] Loader
- [ ] Parallax hero
- [ ] Message/typewriter
- [ ] Gallery reveal
- [ ] Finale/confetti

## Dashboard
- [ ] List pages
- [ ] Edit
- [ ] Duplicate
- [ ] Delete
- [ ] Unpublish

---

# MEMBER 1 — MOTION / PUBLIC PAGE

## Tasks
- [ ] Template registry
- [ ] Shared animated sections
- [ ] Template 1
- [ ] Template 2
- [ ] Template 3
- [ ] Public `/w/[slug]`
- [ ] Hero/parallax
- [ ] Message reveal
- [ ] Gallery
- [ ] Finale
- [ ] Mobile
- [ ] Reduced motion

## Files Changed

| File | Change | Status |
|---|---|---|
| TBD | TBD | ⬜ |

---

# MEMBER 2 — FRONTEND / WIZARD / DASHBOARD

## Tasks
- [ ] Landing
- [ ] Login/signup UI
- [ ] Wizard shell
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
- [ ] Step 4
- [ ] Step 5
- [ ] Step 6
- [ ] Preview
- [ ] Dashboard
- [ ] Edit
- [ ] Insights
- [ ] Mobile

## Files Changed

| File | Change | Status |
|---|---|---|
| TBD | TBD | ⬜ |

---

# MEMBER 3 — BACKEND / DB / AUTH

## Tasks
- [ ] MongoDB connection
- [ ] User model
- [ ] Page model
- [ ] Template model
- [ ] Wish model
- [ ] PageView model
- [ ] Auth
- [ ] Page CRUD
- [ ] Publish
- [ ] Public page API
- [ ] Wishes API
- [ ] Views API
- [ ] Admin API
- [ ] Validation
- [ ] Security
- [ ] Error middleware

## API Changes

| Endpoint | Change | Status |
|---|---|---|
| TBD | TBD | ⬜ |

---

# MEMBER 4 — MEDIA / SHARING

## Tasks
- [ ] Cloudinary config
- [ ] Signed upload
- [ ] Media registration
- [ ] Upload validation
- [ ] Compression
- [ ] Progress
- [ ] Reorder
- [ ] Delete
- [ ] QR
- [ ] Copy link
- [ ] WhatsApp/share
- [ ] OG image

## Files Changed

| File | Change | Status |
|---|---|---|
| TBD | TBD | ⬜ |

---

# MEMBER 5 — DEVOPS / QA / DOCS

## Tasks
- [ ] GitHub repo
- [ ] Branch setup
- [ ] `.env.example`
- [ ] Seed data
- [ ] Deployment
- [ ] Integration
- [ ] QA
- [ ] SPEC.md
- [ ] TEAM_TASKS.md
- [ ] PROMPTS.md
- [ ] README.md
- [ ] Demo assets
- [ ] Final submission check

---

# INTEGRATION TRACKER

| Feature | Owner | Dependency | Status | Tested |
|---|---|---|---|---|
| Auth | M3 | M2 | ⬜ | ⬜ |
| Wizard | M2 | M3 | ⬜ | ⬜ |
| Media | M4 | M2/M3 | ⬜ | ⬜ |
| Templates | M1 | M3 page schema | ⬜ | ⬜ |
| Publish | M3/M4 | M1/M2/M4 | ⬜ | ⬜ |
| Public page | M1 | M3 | ⬜ | ⬜ |
| Dashboard | M2 | M3 | ⬜ | ⬜ |
| Sharing | M4 | Publish | ⬜ | ⬜ |
| Deployment | M5 | All | ⬜ | ⬜ |

---

# KNOWN BUGS

| ID | Bug | Owner | Severity | Status |
|---|---|---|---|---|
| B-001 | TBD | TBD | TBD | Open |

# API CONTRACT CHANGES

| Date | Endpoint/Field | Old | New | Reason | Members Notified |
|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD |

# DB CHANGES

| Date | Collection | Change | Owner |
|---|---|---|---|
| TBD | TBD | TBD | TBD |

# GIT / MERGE ISSUES

| Date | Branch | Issue | Resolution |
|---|---|---|---|
| TBD | TBD | TBD | TBD |

# DEPLOYMENT

- Frontend: TBD
- Backend: TBD
- Database: MongoDB Atlas
- Media: Cloudinary
- Build: ⬜
- Production smoke test: ⬜

# FINAL FREEZE CHECK

- [ ] All P0 tested
- [ ] No unresolved merge conflicts
- [ ] Every member has commits
- [ ] README complete
- [ ] PROMPTS.md complete
- [ ] `.env.example` complete
- [ ] Live links work
- [ ] Sample pages work
- [ ] Mobile tested
- [ ] No secrets
