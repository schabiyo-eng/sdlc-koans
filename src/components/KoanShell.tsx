import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useProgress } from '../lib/ProgressContext'
import { KOAN_ORDER, getKoanMeta } from '../koans/registry'
import { MobileGate } from './MobileGate'
import { PainMeter } from './PainMeter'
import styles from './KoanShell.module.css'

type Props = {
  slug: string
  scenario: ReactNode
  children: ReactNode
}

export function KoanShell({ slug, scenario, children }: Props) {
  const { pain, isUnlocked, progress } = useProgress()
  const meta = getKoanMeta(slug)
  const unlocked = isUnlocked(slug, KOAN_ORDER)
  const idx = KOAN_ORDER.indexOf(slug)
  const pct = Math.round((progress.completed.length / KOAN_ORDER.length) * 100)

  return (
    <>
      <MobileGate />
      <PainMeter level={pain} />
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link to="/" className={styles.brand}>
            SDLC Koans
          </Link>
          {meta && (
            <span className={styles.step}>
              Koan {String(idx + 1).padStart(2, '0')} / {KOAN_ORDER.length}
            </span>
          )}
        </header>

        {!unlocked ? (
          <div className={styles.locked}>
            <p>This koan is still sealed. Walk the path in order.</p>
            <Link to="/koans/idea">Return to the start →</Link>
          </div>
        ) : (
          <>
            {meta && <h1 className={styles.title}>{meta.title}</h1>}
            <div className={styles.scenario}>{scenario}</div>
            {children}
          </>
        )}
      </div>
      <div className={styles.progress} aria-hidden="true">
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </>
  )
}
