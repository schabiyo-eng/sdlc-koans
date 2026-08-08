import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  const notified = useRef(false)

  function open(id: string) {
    setOpened((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  // Fires once the last card opens. The ref keeps a repeated click on that card
  // from unlocking the next beat twice.
  useEffect(() => {
    if (cards.length > 0 && opened.size === cards.length && !notified.current) {
      notified.current = true
      onAllInvestigated?.()
    }
  }, [opened, cards.length, onAllInvestigated])

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
