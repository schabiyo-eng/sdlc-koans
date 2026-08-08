import { useState } from 'react'
import styles from './ChoiceQuestion.module.css'

export type Choice = {
  id: string
  label: string
  correct?: boolean
  wrongFeedback?: string
}

type Props = {
  prompt: string
  choices: Choice[]
  correctFeedback: string
  onCorrect: () => void
}

export function ChoiceQuestion({ prompt, choices, correctFeedback, onCorrect }: Props) {
  const [solved, setSolved] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [flashWrong, setFlashWrong] = useState<string | null>(null)

  function pick(choice: Choice) {
    if (solved) return
    if (choice.correct) {
      setSolved(true)
      setFeedback(correctFeedback)
      onCorrect()
      return
    }
    setFlashWrong(choice.id)
    setFeedback(choice.wrongFeedback ?? 'Not quite — look again.')
    window.setTimeout(() => setFlashWrong(null), 650)
  }

  return (
    <div className={`${styles.wrap} fade-up`}>
      <p className={styles.prompt}>{prompt}</p>
      <div className={styles.options}>
        {choices.map((choice) => {
          let cls = styles.option
          if (solved && choice.correct) cls += ` ${styles.correct}`
          if (flashWrong === choice.id) cls += ` ${styles.wrong}`
          if (solved && !choice.correct) cls += ` ${styles.disabled}`
          return (
            <button
              key={choice.id}
              type="button"
              className={cls}
              onClick={() => pick(choice)}
              disabled={solved}
            >
              {choice.label}
            </button>
          )
        })}
      </div>
      {feedback && (
        <p
          className={`${styles.feedback} ${
            solved ? styles.feedbackOk : styles.feedbackBad
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  )
}
