import type { ReactNode } from 'react'
import { ToolChips } from './ToolChip'
import styles from './Insight.module.css'

type Props = {
  concept: string
  children: ReactNode
  toolIds?: string[]
}

export function Insight({ concept, children, toolIds = [] }: Props) {
  return (
    <div className={styles.insight}>
      <div className={styles.eyebrow}>You named it</div>
      <h2 className={styles.title}>{concept}</h2>
      <div className={styles.body}>{children}</div>
      <ToolChips ids={toolIds} />
    </div>
  )
}
