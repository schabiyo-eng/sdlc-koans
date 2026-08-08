import { Link } from 'react-router-dom'
import styles from './LoopBack.module.css'

type Props = {
  trigger: string
  detail: string
  targetLabel: string
  to?: string
  onAction?: () => void
}

export function LoopBack({ trigger, detail, targetLabel, to, onAction }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.label}>Loop back</div>
      <h3 className={styles.title}>{trigger}</h3>
      <p className={styles.body}>{detail}</p>
      {onAction && !to ? (
        <button type="button" className={styles.btn} onClick={onAction}>
          Return to {targetLabel} →
        </button>
      ) : (
        <Link className={styles.btn} to={to ?? '/'} onClick={onAction}>
          Return to {targetLabel} →
        </Link>
      )}
    </div>
  )
}
