# Kyle Portfolio

Personal portfolio built for the Portfolio v1 assignment.

- **Intro** (`/`): full-width "Kyle Portfolio" wordmark, then About, Projects, Contact and Footer.
- **Project index** (`/work`): a carousel of project cards. Use the arrow keys, swipe, or click the side cards. Press Escape or the close button to return home.
- **Project detail** (`/work/:slug`): summary, tech stack, repo and demo links.

## Tech stack

React 18, Vite, React Router, GSAP, plain CSS (mobile-first adjustments at 760px).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Edit your content

- `src/data/profile.js`: your tagline, about text, email and social links.
- `src/data/projects.js`: the project cards. Set `image` to a file in `public/` to replace the generated cover art with a screenshot.

## Deploy

Push to a public GitHub repo, then import it in Vercel or Netlify. Both work with no extra settings (`vercel.json` and `public/_redirects` handle client-side routing).

Live URL: _add after deploying_
