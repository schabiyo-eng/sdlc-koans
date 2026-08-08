import type { ReactNode } from 'react'
import styles from './ZenQuote.module.css'

export function ZenQuote({ children }: { children: ReactNode }) {
  return <blockquote className={styles.quote}>{children}</blockquote>
}
