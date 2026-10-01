# SPEC — Custom Occasion Page Generator

## 1. Product

Create a personalized animated wish website from creator-provided occasion details, recipient information, messages, language, memories, media and visual theme.

Generated pages are served using a reusable renderer at:

```text
/w/:slug
```

## 2. Roles

### Creator
- Create, preview, publish, edit, duplicate and delete own pages
- View analytics
- Manage wishes on own pages
- Download/share QR

### Viewer
- Open public page
- Enter password if configured
- View unlocked page
- Leave a wish where enabled
- React/share/replay

### Admin
- View users/pages
- Disable pages
- Moderate wishes
- Manage templates
- View platform statistics

## 3. Wizard

```text
1. Occasion
2. Recipient
3. Words + Language
4. Media
5. Style
6. Review
```

## 4. P0 Requirements

- Authentication
- Protected creator dashboard
- Admin seed
- Six-step wizard
- English/Hinglish/Hindi
- Devanagari font support
- Up to 15 images
- Up to 2 videos
- At least 3 distinct templates
- Unique slug
- Shareable URL
- QR
- WhatsApp/share
- Animated intro
- Parallax hero
- Message/typewriter
- Gallery reveal
- Finale/confetti
- Dashboard CRUD

## 5. P1 Requirements

- Autosave
- Live preview
- Image compression
- Upload progress
- Occasion-aware decoration
- Dynamic OG
- Countdown
- Password protection
- Wishes wall
- Analytics
- Admin moderation
- Mobile/performance polish
- Reduced-motion fallback

## 6. P2 / Bonus

- AI message suggestions
- Programmatic Vercel/Netlify deployment
- Microphone candle interaction
- Scratch card / gift box
- 3D
- Music sync
- Google OAuth

## 7. Core API

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

GET    /api/v1/templates

POST   /api/v1/pages
PATCH  /api/v1/pages/:id
POST   /api/v1/pages/:id/publish
POST   /api/v1/pages/:id/unpublish
POST   /api/v1/pages/:id/duplicate
DELETE /api/v1/pages/:id
GET    /api/v1/pages/mine

GET    /api/v1/public/pages/:slug
POST   /api/v1/public/pages/:slug/unlock
POST   /api/v1/public/pages/:slug/view
GET    /api/v1/public/pages/:slug/wishes
POST   /api/v1/public/pages/:slug/wishes

DELETE /api/v1/pages/:id/wishes/:wishId

POST   /api/v1/uploads/sign
POST   /api/v1/media

GET    /api/v1/pages/:id/insights

POST   /api/v1/pages/:id/deploy
GET    /api/v1/pages/:id/deploy

POST   /api/v1/ai/message

GET/PATCH relevant /api/v1/admin/* endpoints
```

## 8. API Contract

### Success

```json
{
  "success": true,
  "data": {},
  "message": "optional"
}
```

### Error

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

### Status Codes

```text
200 OK
201 Created
400 Validation
401 Unauthenticated
403 Forbidden
404 Not Found
409 Conflict
429 Too Many Requests
500 Server Error
```

## 9. Page Data Model

```text
ownerId
slug
status
occasion
customOccasionLabel
occasionDate
revealAt
recipient
from
language
messages[]
memories[]
media[]
theme
settings
ogImageUrl
thumbnailUrl
stats
deploy
```

## 10. Other Collections

```text
users
templates
wishes
pageViews
```

## 11. Business Rules

- Publish requires occasion, recipient name, at least one message, at least one image and a template.
- Name <= 40 characters.
- Message <= 600 characters.
- Media limits are enforced client and server side.
- Unsupported MIME types are rejected.
- Slug is permanent after publishing.
- Future reveal pages must not leak their content through the API.
- Password protection uses bcrypt hashing and verified unlock tokens.
- Public content must be sanitized.
- Public APIs must not return password hashes or owner email.
- Wishes are rate-limited.
- Views should avoid counting owner previews.

## 12. Media

```text
Images: max 15
Videos: max 2
Image types: jpg/png/webp/heic
Image size: <= 8 MB
Video: mp4
Video size: <= 50 MB
Video duration: <= 60 sec
```

## 13. Templates

Minimum:

```text
Neon Night
Pastel Dream
Royal Gold
```

Each must have genuinely different:
- layout
- palette
- typography
- animation/signature effects

## 14. Generated Page Sections

```text
Lock screen
Intro / loader
Hero
Message
Memory timeline
Gallery
Video
Wishes wall
Finale
Global music / scroll controls / footer
```

## 15. Non-Functional Requirements

- Mobile responsive
- No horizontal scroll
- Loading/error/empty/success states
- Client + server validation
- Sanitization
- Secure environment variables
- Reasonable animation performance
- Lazy media loading
- Reduced-motion fallback
- Clean folder structure
- Reusable components

## 16. Architecture Decisions

Record decisions here during the exam.

| Decision | Choice | Reason | Date |
|---|---|---|---|
| Frontend | TBD | TBD | TBD |
| Backend | TBD | TBD | TBD |
| Auth | TBD | TBD | TBD |
| Media | Cloudinary | PS recommendation | TBD |
| DB | MongoDB Atlas | PS requirement | TBD |
