# Wishly — Product & Technical Specification

## 1. Product Definition

**Product:** Wishly — Custom Occasion Page Generator

**Problem statement:** Build a full-stack experience that lets a creator turn a short occasion brief, memories and media into a personalized, animated and shareable occasion webpage.

**Primary audience:** A creator preparing a digital birthday, anniversary, friendship or similar celebration for another person.

**Primary outcome:** A creator can complete a guided flow, save the occasion page, publish it and share a unique public URL.

---

## 2. Goals

### P0 — Core

- Account signup, login and logout.
- Protected creator workspace.
- Occasion page creation and editing.
- Template selection / template gallery.
- AI-assisted wish/message generation.
- Image/media upload through Cloudinary.
- Unique public slug and public page.
- Public wish and candle interactions.
- Admin workspace.
- CI checks for install, lint and production build.

### P1 — Experience improvements

- Richer creator preview / review flow.
- Page insights.
- Better media progress and validation.
- Stronger public-page interaction polish.
- Deployment and production hardening.

### Out of current verified scope

The original problem statement referenced additional items such as MongoDB Atlas, Google OAuth, dynamic OG images, password protection, countdown locking and several bonus interactions. These should not be described as completed unless the codebase verifies them.

---

## 3. User Roles

### Creator

Can authenticate, create pages, edit pages, review pages, publish/share pages and view available page insights.

### Admin

Can access the admin area and admin API surface for administrative / moderation-oriented actions.

### Public Guest

Can open a published `/w/[slug]` page and interact with supported public actions such as wishes and candle interactions.

---

## 4. Primary User Journey

```text
Landing
  ↓
Signup / Login
  ↓
Dashboard
  ↓
Create Occasion
  ↓
Enter content / memories
  ↓
Choose template / visual direction
  ↓
Attach media
  ↓
AI assistance (optional)
  ↓
Review
  ↓
Publish
  ↓
Share public URL
  ↓
Guest interaction
```

---

## 5. Functional Requirements

### Authentication

- Signup creates a user record.
- Login validates credentials and establishes authenticated state.
- Protected APIs verify the authenticated user where required.
- Logout invalidates the active session state.
- `/api/auth/me` exposes the current authenticated user state.

### Creator pages

- List creator-owned pages.
- Create a new page.
- Read page details.
- Update page details.
- Delete a page.
- Duplicate a page.
- Open an edit experience.
- Open an insights experience.
- Review a page before publishing.

### Media

- Accept supported media through `/api/upload`.
- Send upload work to Cloudinary.
- Return media information to the application for attachment to the occasion page.
- Keep provider credentials on the server.

### AI

- Generate a personalized wish/message through server-side API routes.
- Accept contextual inputs from the creator flow.
- Return generated content to the UI for review / use.

### Public page

- Resolve a page through its slug.
- Render the public celebration experience.
- Accept public wishes.
- Accept candle interactions where supported.

---

## 6. Route Map

| Route | Type | Purpose |
|---|---|---|
| `/` | UI | Landing |
| `/login` | UI | Login |
| `/signup` | UI | Signup |
| `/dashboard` | UI | Creator dashboard |
| `/create` | UI | Creation flow |
| `/create/[id]/review` | UI | Review |
| `/templates` | UI | Template gallery |
| `/pages/[id]/edit` | UI | Edit page |
| `/pages/[id]/insights` | UI | Insights |
| `/admin` | UI | Admin area |
| `/w/[slug]` | UI | Public page |

---

## 7. API Contract Surface

### Auth

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Pages

```text
GET    /api/pages
POST   /api/pages
GET    /api/pages/[id]
PATCH  /api/pages/[id]
DELETE /api/pages/[id]
POST   /api/pages/[id]/duplicate
```

### AI

```text
POST /api/ai/wish
POST /api/ai/generate-wish
```

### Upload

```text
POST /api/upload
```

### Public

```text
GET  /api/w/[slug]
POST /api/w/[slug]/wish
POST /api/w/[slug]/candle
```

### Admin

```text
GET /api/admin
```

> The exact request/response schemas remain defined in the corresponding route handlers. This document is the product-level contract map, not a generated OpenAPI specification.

---

## 8. Architecture

```text
Browser
   │
   ▼
Next.js + React UI
   │
   ▼
Next.js Route Handlers
   ├── Auth (JWT + bcryptjs)
   ├── Page CRUD
   ├── AI routes
   ├── Upload route ──────► Cloudinary
   └── Public interaction APIs
   │
   ▼
lib/db.ts
   └── in-memory store + JSON-backed persistence
```

### Important implementation truth

The current repository does **not** use MongoDB as its active persistence layer. `lib/db.ts` currently maintains application data through a runtime global store and a JSON persistence file. MongoDB may remain a future migration target, but it should be treated as a future architecture decision rather than a current dependency.

---

## 9. Data Model — Current Concepts

### User

Typical fields currently represented include:

- `id`
- `name`
- `email`
- password hash
- `role`
- timestamps / user metadata

### Wish Page

The application represents an occasion page with concepts including:

- page identifier
- unique slug
- creator reference
- occasion / recipient information
- theme / visual configuration
- story / content
- media
- publication state / sharing information
- guest interaction data where applicable

### Guest Wish

Represents public wish interaction attached to a generated page.

---

## 10. Environment Configuration

```env
NEXT_PUBLIC_APP_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=wishly
```

Do not commit `.env.local` or real credentials.

---

## 11. Security Requirements

- Hash passwords with `bcryptjs` rather than storing plaintext passwords.
- Keep JWT / signing secrets server-side.
- Keep Cloudinary API secrets server-side.
- Do not expose `.env.local` in Git.
- Validate request bodies before mutating application state.
- Protect creator/admin routes according to role/session.
- Validate uploaded media before forwarding to storage.

---

## 12. Reliability & Quality

The CI workflow in `.github/workflows/ci.yml` performs:

```text
bun install --frozen-lockfile
       ↓
bun run lint
       ↓
bun run build
```

Feature work follows the integration path:

```text
feature/* → dev → main
```

---

## 13. Current Completion State

| Area | State |
|---|---|
| M1 public experience | Complete / integrated |
| M2 creator experience | Complete / integrated |
| M3 auth + APIs + data layer | Complete / integrated |
| M4 Cloudinary upload | Complete / integrated |
| M5 CI + integration | Complete / integrated |
| Final QA | In progress / requires execution |
| Production deployment | To be verified |
| Live URL | To be added |
| Demo video | To be added |

---

## 14. Definition of Done

A release is considered demo-ready when:

- `main` contains the intended integrated work.
- `bun install --frozen-lockfile` succeeds.
- `bun run lint` succeeds.
- `bun run build` succeeds.
- Local end-to-end creator flow works.
- Media upload works with valid Cloudinary credentials.
- Public URL flow works.
- Auth and protected routes are checked.
- No secrets are committed.
- README contains live/demo links.
- Team responsibilities are documented.
