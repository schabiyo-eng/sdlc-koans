import { Link } from 'react-router-dom'
import styles from './ContinueLink.module.css'

export function ContinueLink({ to, label }: { to: string; label: string }) {
  return (
    <div className={styles.wrap}>
      <Link className={styles.link} to={to}>
        {label} →
      </Link>
    </div>
  )
}
