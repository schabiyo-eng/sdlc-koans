import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { LoopBack } from '../components/LoopBack'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function MonitorKoan() {
  const { setPain, complete, visitLoop } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="monitor"
      scenario={
        <>
          It shipped at 2:14pm. At 2:19pm, error rates tick up.
          <br />
          Without eyes on production, you would still be celebrating.
        </>
      }
    >
      <ZenQuote>
        A silent system
        <br />
        teaches you only after customers shout.
      </ZenQuote>

      <InvestigatePanel
        cards={[
          {
            id: 'silent',
            title: 'Silent system',
            preview: 'No dashboards. No alerts. “Looks fine.”',
            reveal: 'The defect exists—you simply cannot hear it.',
          },
          {
            id: 'speaking',
            title: 'Speaking system',
            preview: (
              <span className="mono">
                ALERT error_rate &gt; 2%
                <br />
                fullName throwing on null last
              </span>
            ),
            reveal: 'Now you can open a defect ticket before the support queue melts.',
          },
        ]}
        onAllInvestigated={() => setStep(1)}
      />

      {step >= 1 && step < 3 && (
        <ChoiceQuestion
          prompt="What did monitoring just give the team?"
          choices={[
            {
              id: 'blame',
              label: 'A person to blame',
              wrongFeedback: 'Signals beat scapegoats.',
            },
            {
              id: 'signal',
              label: 'An early signal that production needs another change',
              correct: true,
            },
            {
              id: 'done',
              label: 'Proof the project is finished forever',
              wrongFeedback: 'Shipping starts the learning—not the ending.',
            },
          ]}
          correctFeedback="Yes. Monitoring turns production into feedback."
          onCorrect={() => {
            setPain('relief')
            setStep(2)
            complete('monitor')
          }}
        />
      )}

      {step >= 2 && (
        <>
          <Insight concept="Monitoring" toolIds={['sentry', 'datadog', 'grafana']}>
            Monitoring makes production audible. Tools like Sentry, Datadog, or Grafana turn
            silent failures into signals. A defect found here is not failure of the
            process—it is the process working.
          </Insight>
          <LoopBack
            trigger="Defect found in production"
            detail="The alert becomes work: a new ticket. The path does not end at deploy—it returns to the board."
            targetLabel="the loop (see the cycle)"
            to={`/koans/${nextSlug('monitor')}`}
            onAction={() => {
              visitLoop('monitor')
              setPain('friction')
            }}
          />
          <ContinueLink
            to={`/koans/${nextSlug('monitor')}`}
            label="Continue into the loop"
          />
        </>
      )}
    </KoanShell>
  )
}
