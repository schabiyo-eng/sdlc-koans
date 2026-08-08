const STORAGE_KEY = 'sdlc-koans-progress'

export type ProgressState = {
  completed: string[]
  loopVisits: Record<string, number>
}

const empty: ProgressState = { completed: [], loopVisits: {} }

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...empty, completed: [], loopVisits: {} }
    const parsed = JSON.parse(raw) as ProgressState
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      loopVisits: parsed.loopVisits ?? {},
    }
  } catch {
    return { ...empty, completed: [], loopVisits: {} }
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function markComplete(slug: string): ProgressState {
  const state = loadProgress()
  if (!state.completed.includes(slug)) {
    state.completed = [...state.completed, slug]
    saveProgress(state)
  }
  return state
}

export function recordLoopVisit(slug: string): ProgressState {
  const state = loadProgress()
  state.loopVisits = {
    ...state.loopVisits,
    [slug]: (state.loopVisits[slug] ?? 0) + 1,
  }
  saveProgress(state)
  return state
}

export function resetProgress(): ProgressState {
  saveProgress({ completed: [], loopVisits: {} })
  return { completed: [], loopVisits: {} }
}
