import styles from './MobileGate.module.css'

export function MobileGate() {
  return (
    <div className={styles.gate} aria-hidden="true">
      <div className={styles.mark}>SDLC</div>
      <p className={styles.text}>
        Some paths require a wider view.
        <br />
        Return on a larger screen.
      </p>
    </div>
  )
}
