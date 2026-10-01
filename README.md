# Custom Occasion Page Generator

> **W3Grads Full Stack Development — Vibe Coding Examination | Problem Statement 02**

A full-stack platform that lets a creator build a personalized, animated birthday/anniversary/occasion webpage from a short form, photos/videos, language, memories and a visual template, then publish it through a unique shareable URL.

## Team

| Member | Name | GitHub | Primary Responsibility |
|---|---|---|---|
| M1 | TBD | TBD | Motion / Public Wish Page / Templates |
| M2 | TBD | TBD | Creator Frontend / Wizard / Dashboard |
| M3 | TBD | TBD | Backend / MongoDB / Auth / APIs |
| M4 | TBD | TBD | Media / Cloudinary / QR / Sharing / OG |
| M5 | TBD | TBD | DevOps / Integration / QA / Documentation |

## Live Links

- Frontend: TBD
- Backend: TBD
- Demo video: TBD

## Tech Stack

- Next.js / React
- Tailwind CSS
- Framer Motion
- Node.js / Express or Next.js Route Handlers
- MongoDB Atlas / Mongoose
- Cloudinary
- JWT + bcrypt
- Zod
- Vercel / Netlify
- Render / Railway if separate backend

## Core Features

### P0 — Must Have
- [ ] Signup / login / logout
- [ ] Protected creator dashboard
- [ ] Seeded admin
- [ ] Six-step creation wizard
- [ ] English / Hinglish / Hindi
- [ ] Upload up to 15 images and 2 videos
- [ ] Cloudinary media pipeline
- [ ] At least 3 distinct templates
- [ ] Unique slug and public URL
- [ ] Copy link / QR / WhatsApp sharing
- [ ] Animated public wish page
- [ ] Creator dashboard CRUD

### P1 — Should Have
- [ ] Autosave
- [ ] Live preview
- [ ] Image compression / upload progress
- [ ] Dynamic OG image
- [ ] Countdown lock
- [ ] Password protection
- [ ] Wishes wall
- [ ] Analytics
- [ ] Admin moderation
- [ ] Performance / reduced-motion support

### P2 — Bonus
- [ ] AI message suggestions
- [ ] Individual-page auto deployment
- [ ] Microphone candle blow
- [ ] Scratch card / gift box
- [ ] 3D scene
- [ ] Music sync
- [ ] Google OAuth

## Architecture

```text
Creator Browser
      |
      v
Next.js / React
      |
      | /api/v1
      v
Node + Express / Next Route Handlers
      |
      +------> MongoDB Atlas
      |
      +------> Cloudinary
      |
      +------> Optional AI API
      |
      +------> Optional Vercel/Netlify API
      |
      v
Public Wish Page
/w/[slug]
```

## Main Routes

```text
/                 Landing
/login            Login
/signup           Signup
/dashboard        Creator dashboard
/create           Six-step wizard
/pages/:id/edit   Edit page
/pages/:id/insights
/templates        Template gallery
/admin             Admin
/w/:slug          Public generated wish page
```

## API Convention

Base URL:

```text
/api/v1
```

Success:

```json
{
  "success": true,
  "data": {},
  "message": "optional"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": []
  }
}
```

## Local Setup

```bash
git clone <REPOSITORY_URL>
cd occasion-generator
```

Install dependencies according to the final project structure.

Create environment file:

```bash
cp .env.example .env
```

Fill only the required values. Never commit `.env`.

## Environment Variables

See `.env.example`.

Never commit:
- MongoDB passwords
- JWT secrets
- Cloudinary API secret
- deployment tokens
- AI API keys

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | TBD | TBD |
| Creator | TBD | TBD |

## Documentation

- [SPEC.md](./SPEC.md) — product and technical specification
- [TEAM_TASKS.md](./TEAM_TASKS.md) — live team task board
- [PROMPTS.md](./PROMPTS.md) — important AI prompts used during the exam
- [CONTRIBUTING.md](./CONTRIBUTING.md) — team Git workflow

## Known Limitations

Update this honestly before submission.

- TBD

## Submission Checklist

- [ ] Final code on final/default branch
- [ ] Every member appears in Git history
- [ ] README complete
- [ ] `.env.example` complete
- [ ] `PROMPTS.md` complete
- [ ] Live frontend
- [ ] Live backend if separate
- [ ] Demo video
- [ ] Test credentials
- [ ] At least 3 sample generated pages
- [ ] Birthday sample
- [ ] Anniversary sample
- [ ] At least 2 languages
- [ ] Mobile recording
- [ ] No secrets committed
- [ ] P0 flow tested
