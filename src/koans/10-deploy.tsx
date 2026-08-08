import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function DeployKoan() {
  const { setPain, complete } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="deploy"
      scenario={
        <>
          The change is on <span className="mono">main</span>. A stakeholder asks:
          <br />
          <em>“So users have it now, right?”</em>
        </>
      }
    >
      <ZenQuote>
        Done on the shared line
        <br />
        is not done in the world.
      </ZenQuote>

      <InvestigatePanel
        cards={[
          {
            id: 'main',
            title: 'main branch',
            preview: 'Code accepted. History updated.',
            reveal: 'Still only in the repository—not yet in an environment users touch.',
          },
          {
            id: 'staging',
            title: 'Staging',
            preview: 'A dress rehearsal environment',
            reveal: 'Safer place to verify the ship before production.',
          },
          {
            id: 'prod',
            title: 'Production',
            preview: 'Where real users live',
            reveal: 'Deploy is the act that carries the change here.',
          },
        ]}
        onAllInvestigated={() => setStep(1)}
      />

      {step >= 1 && (
        <ChoiceQuestion
          prompt="What does deploy mean?"
          choices={[
            {
              id: 'commit',
              label: 'Saving a file on a laptop',
              wrongFeedback: 'Local save ≠ reaching users.',
            },
            {
              id: 'ship',
              label: 'Shipping the change into an environment users can reach',
              correct: true,
            },
            {
              id: 'ticket',
              label: 'Closing the ticket without releasing',
              wrongFeedback: 'Closing paperwork is not a deploy.',
            },
          ]}
          correctFeedback="Yes. Deploy is how merged work becomes reachable."
          onCorrect={() => {
            setPain('relief')
            setStep(2)
            complete('deploy')
          }}
        />
      )}

      {step >= 2 && (
        <>
          <Insight concept="Deploy" toolIds={['vercel', 'harness']}>
            Deploy is how merged work becomes reachable. Staging and production are
            runtimes—places the change actually runs for people. Platforms like Vercel or
            Harness are where that happens. Merged is necessary. Deployed is what users feel.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('deploy')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
