# AP Calculus Tutoring Dashboard

Local React dashboard for AP Calculus AB/BC tutoring.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

## Current Features

- Tutor/admin page with student setup, tutor notes, and KPI inputs.
- AP Calculus AB/BC progress tracker with saved concept-level mastery checkboxes plus unit workflow markers.
- Timeline page that automatically uses logged taught/known/reviewed dates to show AP unit progress bars and completion milestones.
- Function lab with an interactive SVG plot for `f(x)`, numerical derivative, accumulated integral, domain, and range controls.
- Parent-safe page showing progress, recent practice, homework completion, priority areas, and tutor notes.
- Browser-local saving with `localStorage`.

## Later Production Needs

For a live parent/tutor site, add authentication, real student records, database-backed progress, parent-specific permissions, and deployment hosting.
