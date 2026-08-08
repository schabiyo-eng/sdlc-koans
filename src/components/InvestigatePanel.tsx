import { useState, type ReactNode } from 'react'
import styles from './InvestigatePanel.module.css'

export type InvestigateCard = {
  id: string
  title: string
  preview: ReactNode
  reveal: ReactNode
}

type Props = {
  cards: InvestigateCard[]
  onAllInvestigated?: () => void
}

export function InvestigatePanel({ cards, onAllInvestigated }: Props) {
  const [opened, setOpened] = useState<Set<string>>(new Set())

  function open(id: string) {
    if (opened.has(id)) return
    const next = new Set(opened)
    next.add(id)
    setOpened(next)
    if (next.size === cards.length) onAllInvestigated?.()
  }

  return (
    <div className={styles.grid}>
      {cards.map((card) => {
        const isOpen = opened.has(card.id)
        return (
          <button
            key={card.id}
            type="button"
            className={`${styles.card} ${isOpen ? styles.opened : ''}`}
            onClick={() => open(card.id)}
            disabled={isOpen}
          >
            <div className={styles.header}>
              <span className={styles.title}>{card.title}</span>
              {!isOpen && <span className={styles.hint}>Investigate</span>}
            </div>
            <div className={styles.body}>{card.preview}</div>
            {isOpen && <div className={styles.reveal}>{card.reveal}</div>}
          </button>
        )
      })}
    </div>
  )
}
