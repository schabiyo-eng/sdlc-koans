import { Link } from 'react-router-dom'
import { MobileGate } from './MobileGate'
import { useProgress } from '../lib/ProgressContext'
import { KOAN_ORDER } from '../koans/registry'
import styles from './Opening.module.css'

export function Opening() {
  const { reset, progress } = useProgress()
  const started = progress.completed.length > 0
  const pathDone = KOAN_ORDER.every((slug) => progress.completed.includes(slug))

  return (
    <>
      <MobileGate />
      <div className={styles.page}>
        <h1 className={styles.brand}>SDLC Koans</h1>
        <p className={styles.zen}>
          You work next to builders.
          <br />
          They speak in tickets, branches, reviews, and red builds.
          <br />
          <br />
          Learn the path they walk—before you sell, design, or advise on it.
        </p>
        <div className={styles.cta}>
          <Link className={styles.btn} to="/koans/idea">
            {started ? 'Continue the path →' : 'Begin the path →'}
          </Link>
          {pathDone && (
            <Link className={styles.btnSecondary} to="/map">
              View the delivery map →
            </Link>
          )}
          <p className={styles.hint}>One idea at a time. Discover before you name.</p>
          {started && (
            <button type="button" className={styles.reset} onClick={reset}>
              Reset progress
            </button>
          )}
        </div>
      </div>
      <div className={styles.progress} aria-hidden="true" />
    </>
  )
}
