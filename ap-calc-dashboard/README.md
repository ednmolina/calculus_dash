# AP Calculus Tutoring Dashboard

React dashboard for AP Calculus AB/BC tutoring.

## Run Locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

## Current Features

- Tutor/admin page with student setup, tutor notes, and KPI inputs.
- Shared dashboard mode using Firestore. Open the same `?dashboard=...` URL on multiple devices to sync changes live.
- AP Calculus AB/BC progress tracker with saved concept-level mastery checkboxes plus unit workflow markers.
- Timeline page that automatically uses logged taught/known/reviewed dates to show AP unit progress bars and completion milestones.
- Function lab with an interactive SVG plot for `f(x)`, numerical derivative, accumulated integral, domain, and range controls.
- Parent-safe page showing progress, recent practice, homework completion, priority areas, and tutor notes.
- Browser-local caching with `localStorage` as a fallback.

## Firebase Setup

1. Copy `.env.example` to `.env` and fill in the Firebase web config values.
2. In Firebase Console, create a Firestore database.
3. In the app, enter a shared dashboard ID on the Tutor/Admin page and use that same ID on every device.
4. For GitHub Pages deploys, add the same `VITE_FIREBASE_*` values as GitHub Actions repository secrets.

## Later Production Needs

For a real public parent/tutor site, add authentication and stricter Firestore rules before sharing student data broadly.
