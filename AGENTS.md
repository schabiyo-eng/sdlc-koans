# SDLC Koans — agent notes

Interactive Vite + React site teaching the software delivery loop through progressive koans.

## Commands

- `npm run dev` — local server (open `/sdlc-koans/` because of GitHub Pages `base`)
- `npm run build` — typecheck + production build to `dist/`
- `npm run preview` — preview the production build

## Conventions

Project rules live in `.cursor/rules/`:

- Pedagogy (always on)
- Koan authoring (`src/koans/**`)
- Design tokens
- React + Vite

Hooks in `.cursor/hooks.json` format on edit and ask before destructive git.
