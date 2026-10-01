# Wishly landing page

The home route uses an editorial cream, coral, and sage design. Its styles are
scoped under `.wl-landing`, so the dashboard, creator, and public wish pages keep
their existing styles.

## Stylesheets

- `styles/landing.css`: layout, components, responsive breakpoints, focus states,
  reduced motion, contrast preferences, and print styling.
- `styles/landing-themes.css`: six complete color recipes for the illustrated
  greeting and theme inspiration cards.
- `styles/landing-ornaments.css`: 24 deterministic animated confetti shapes.

Together these files contain approximately 4,900 lines of readable CSS. Theme
recipes and confetti are generated from a small maintained source:

```sh
python3 scripts/generate-landing-styles.py
```

The checked-in stylesheets need no generation step during builds.

## Interactions

The greeting preview reveals a message and launches confetti. Its color buttons
switch the preview palette. Occasion filters narrow the six inspiration cards;
these cards link to the existing template gallery, which remains the source of
available creator templates. The mobile navigation and FAQ are keyboard
accessible. The wish form posts to the existing `/api/ai/wish` endpoint and
provides loading, error, and copy feedback. Without a Gemini key, that endpoint
uses its existing local fallback.

All illustrations use CSS, so the landing does not require external photo
requests or a new image dependency. Reduced motion disables decorative
animations and respects the confetti library's reduced-motion preference.

## Validation

```sh
npm run lint
npm run build
```

Check the home route at desktop and mobile widths, select each preview palette,
filter the gallery, reveal the surprise, expand FAQ answers, and submit the wish
form. Verify the existing `/create`, `/templates`, `/login`, and `/dashboard`
links remain accessible.

Verified locally: production build passed; lint passed with 12 existing warnings
outside the home route. Browser checks passed for greeting reveal, palette
switching, occasion filtering, FAQ, wish generation, clipboard feedback, and
mobile menu. No horizontal overflow at 320, 375, 768, or 1440 pixels; no browser
console errors were observed.
