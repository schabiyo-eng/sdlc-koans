# SDLC Koans — Bugbot review rules

Interactive Vite + React SPA that teaches the software delivery loop through
progressive koans. Audience: people near developers (AEs, FDEs, SAs). Deployed
to GitHub Pages at base `/sdlc-koans/`.

Bugbot: prioritize real runtime bugs, broken pedagogy gates, and regressions that
would 404 or double-advance a learner. Skip style nits and copy preferences.

## Project invariants (blocking)

- **No backend, auth, secrets, or live GitHub / ticketing APIs.** Progress must
  stay in `localStorage` via `lib/progress.ts` / `ProgressContext`. Flag any new
  network call, env secret in client code, or parallel progress store.
- **GitHub Pages SPA fallback.** If `.github/workflows/deploy.yml` changes the
  build or upload steps, require that `dist/404.html` is still produced as a copy
  of `dist/index.html` before the Pages artifact upload. Missing it breaks deep
  links and refresh on `/koans/:slug` and `/map`.
- **Client routing.** Keep React Router `BrowserRouter` with Vite `base`. Flag
  absolute asset URLs that ignore `import.meta.env.BASE_URL` (tool logos, public
  paths).
- **One-shot learner callbacks.** Components that unlock the next beat
  (`CodeBlank.onPass`, `InvestigatePanel.onAllInvestigated`, PainMeter emitters)
  must not fire twice on double-click, held Enter, or stale closed-over state.
  Prefer a ref or functional state update when the guard depends on "already
  done."

## Koans (`src/koans/**`)

Order of a beat is fixed: zen → scenario → investigate / blank → question →
insight (name) → tools → continue. Flag PRs that name the concept in the zen,
scenario, or investigate copy before the Insight.

- Register every new koan in `registry.ts` (slug, title, toolIds, Component) and
  keep `KOAN_ORDER` coherent with gating.
- Prefer shared components (`InvestigatePanel`, `ChoiceQuestion`, `CodeBlank`,
  `LoopBack`, `Insight`, `ToolChips`) over one-off UI.
- Review / CI failure beats must use `LoopBack` and `visitLoop(slug)` without
  erasing completed progress.
- `CodeBlank` answers are intentionally multiple acceptable strings (trimmed,
  case-insensitive). Do not flag "loose" answer matching as a bug.
- Tools are introduced by role first, then name, via `lib/tools.ts` + `ToolChips`.
  Flag hard-coded tool lists outside that registry.

## Delivery map (`src/components/SdlcMap.tsx`, `src/lib/sdlcMap.ts`)

- Parallel review is intentional: Human review and Auto review share a `slot`
  and fan in to CI. Do not "fix" that into a single node.
- Both review loop-backs intentionally share one drawn arc (`origin`). An arc
  from the outer node through the inner node is a geometry bug, not missing
  coverage.
- Frame narration (`JOURNEY[].line`) and `hold` multipliers are storytelling
  choices. Flag broken timing / stuck animation / wrong `with` pairing, not
  copy tone.

## React / CSS

- Functional components only; CSS modules colocated with components.
- `@keyframes` used from a CSS module must be defined in that same module (or
  the animation name will be scoped and silently fail, leaving `opacity: 0`).
- Do not invent brand colors — use tokens in `src/styles/tokens.css`.

## Severity guidance

| Treat as blocking | Usually ignore |
| --- | --- |
| Double completion / double `onPass` | Serif vs mono, spacing nits |
| Missing Pages `404.html` / broken `BASE_URL` | Preferring different CSS approach |
| Naming the concept before Insight | Alternate wording of zen quotes |
| New backend / auth / secrets | Missing unit tests (this app has none by design) |
| Progress written outside `lib/progress.ts` | Logo SVG path churn |

## Related agent rules (optional context)

- [Pedagogy](rules/sdlc-koans-pedagogy.mdc)
- [Koan authoring](rules/koan-authoring.mdc)
- [React + Vite](rules/react-vite.mdc)
- [Design tokens](rules/design-tokens.mdc)
