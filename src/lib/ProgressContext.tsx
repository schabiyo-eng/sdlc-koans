import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadProgress,
  markComplete as persistComplete,
  recordLoopVisit as persistLoop,
  resetProgress as persistReset,
  type ProgressState,
} from './progress'

export type PainLevel = 'calm' | 'friction' | 'relief'

type ProgressContextValue = {
  progress: ProgressState
  pain: PainLevel
  setPain: (level: PainLevel) => void
  complete: (slug: string) => void
  visitLoop: (slug: string) => void
  reset: () => void
  isComplete: (slug: string) => boolean
  isUnlocked: (slug: string, order: string[]) => boolean
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [pain, setPain] = useState<PainLevel>('calm')

  const complete = useCallback((slug: string) => {
    setProgress(persistComplete(slug))
    setPain('relief')
  }, [])

  const visitLoop = useCallback((slug: string) => {
    setProgress(persistLoop(slug))
  }, [])

  const reset = useCallback(() => {
    setProgress(persistReset())
    setPain('calm')
  }, [])

  const isComplete = useCallback(
    (slug: string) => progress.completed.includes(slug),
    [progress.completed],
  )

  const isUnlocked = useCallback(
    (slug: string, order: string[]) => {
      const idx = order.indexOf(slug)
      if (idx <= 0) return true
      const prev = order[idx - 1]
      return progress.completed.includes(prev)
    },
    [progress.completed],
  )

  const value = useMemo(
    () => ({
      progress,
      pain,
      setPain,
      complete,
      visitLoop,
      reset,
      isComplete,
      isUnlocked,
    }),
    [progress, pain, complete, visitLoop, reset, isComplete, isUnlocked],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
