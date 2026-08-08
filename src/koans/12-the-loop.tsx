import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'

const CYCLE = [
  'Ticket: “fullName throws when last is null”',
  'Branch: fix/null-lastname',
  'Implement: guard nulls',
  'Commit → PR → Review → CI',
  'Merge → Deploy',
  'Monitor: error rate returns to normal',
]

export function TheLoopKoan() {
  const { setPain, complete, progress } = useProgress()
  const [revealed, setRevealed] = useState(0)
  const [step, setStep] = useState(0)

  const felt = [
    progress.loopVisits.review ? 'review' : null,
    progress.loopVisits.ci ? 'CI' : null,
    progress.loopVisits.monitor ? 'monitoring' : null,
  ].filter(Boolean) as string[]

  useEffect(() => {
    setPain('calm')
  }, [setPain])

  useEffect(() => {
    if (revealed >= CYCLE.length) {
      setStep(1)
      return
    }
    const t = window.setTimeout(() => setRevealed((n) => n + 1), 700)
    return () => window.clearTimeout(t)
  }, [revealed])

  return (
    <KoanShell
      slug="the-loop"
      scenario={
        <>
          The production defect became a ticket. Watch one fast cycle—
          <br />
          the same path you walked, compressed.
        </>
      }
    >
      <ZenQuote>
        Delivery is not a finish line.
        <br />
        It is a circle that learns.
      </ZenQuote>

      <ol
        className="fade-up mono"
        style={{
          maxWidth: '28rem',
          margin: '0 auto 1.5rem',
          paddingLeft: '1.25rem',
          color: 'var(--ink-secondary)',
          lineHeight: 1.9,
        }}
      >
        {CYCLE.map((item, i) => (
          <li
            key={item}
            style={{
              opacity: i < revealed ? 1 : 0.2,
              transition: 'opacity 0.35s ease',
            }}
          >
            {item}
          </li>
        ))}
      </ol>

      {felt.length > 0 && (
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--ink-muted)',
            marginBottom: '1rem',
          }}
        >
          You already felt loop-backs earlier ({felt.join(', ')}).
        </p>
      )}

      {step >= 1 && (
        <ChoiceQuestion
          prompt="What is the software delivery lifecycle, at its core?"
          choices={[
            {
              id: 'line',
              label: 'A straight line that ends at deploy',
              wrongFeedback: 'Deploy is a station—not the terminus.',
            },
            {
              id: 'loop',
              label: 'An iterative loop: idea → change → ship → learn → again',
              correct: true,
            },
            {
              id: 'tools',
              label: 'A list of tools with no order',
              wrongFeedback: 'Tools serve the loop; they are not the loop.',
            },
          ]}
          correctFeedback="Yes. SDLC is a learning cycle—not a one-way march."
          onCorrect={() => {
            setPain('relief')
            setStep(2)
            complete('the-loop')
          }}
        />
      )}

      {step >= 2 && (
        <>
          <Insight concept="The iteration loop">
            Review fails → back to implement. CI fails → back to implement. Production
            defects → back to a ticket. That is not thrash. That is how software improves.
          </Insight>
          <ContinueLink to="/map" label="See the full path" />
        </>
      )}
    </KoanShell>
  )
}
