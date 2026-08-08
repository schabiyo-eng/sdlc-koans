# SDLC Koans

Interactive exercises that teach the software development lifecycle the way Ruby Koans taught Ruby: investigate, discover, then name the concept.

Built for Account Executives, FDEs, Solutions Architects, and anyone who works near developers.

**Live:** https://schabiyo-eng.github.io/sdlc-koans/  
**Repo:** https://github.com/schabiyo-eng/sdlc-koans

## The path (a loop, not a line)

```
Idea → Ticket → Branch → Implement → Commit → PR
  → Review → CI → Merge → Deploy → Monitor → (back)
```

Failures are part of the lesson:

- Review changes requested → back to **Implement**
- CI red → back to **Implement**
- Defect in monitoring → new **Ticket** / see **the loop**

## Run locally

```bash
npm install
npm run dev
```

Open the app at the Vite URL under `/sdlc-koans/` (GitHub Pages `base` path).

```bash
npm run build    # typecheck + production build
npm run preview  # serve dist/
```

Progress is stored in `localStorage` (`sdlc-koans-progress`). Use **Reset progress** on the opening page to start over.

## Stack

Vite + React + TypeScript, React Router, CSS modules. No backend.

## Project guidance for agents

See [AGENTS.md](AGENTS.md) and `.cursor/rules/` for pedagogy, koan authoring, design tokens, and React conventions. Light hooks live in `.cursor/hooks.json`.

## Deploy

Pushes to `main` build and publish `dist/` to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Enable **Settings → Pages → Source: GitHub Actions** on the repository if it is not already on.
