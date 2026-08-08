import type { PainLevel } from '../lib/ProgressContext'
import styles from './PainMeter.module.css'

const LABELS: Record<PainLevel, string> = {
  calm: 'Steady…',
  friction: 'This is frustrating…',
  relief: '…that’s better',
}

export function PainMeter({ level }: { level: PainLevel }) {
  const cls =
    level === 'friction'
      ? `${styles.meter} ${styles.friction}`
      : level === 'relief'
        ? `${styles.meter} ${styles.relief}`
        : styles.meter

  return (
    <div className={cls} aria-live="polite">
      <span className={styles.dot} />
      <span>{LABELS[level]}</span>
    </div>
  )
}
