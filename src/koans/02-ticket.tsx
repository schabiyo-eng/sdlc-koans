import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function TicketKoan() {
  const { setPain, complete } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="ticket"
      scenario={
        <>
          The ask arrived in Slack at 4:47pm:
          <br />
          <em>“Can someone look at the checkout thing when free?”</em>
        </>
      }
    >
      <ZenQuote>
        Invisible work cannot be finished—
        <br />
        only forgotten.
      </ZenQuote>

      <InvestigatePanel
        cards={[
          {
            id: 'slack',
            title: 'Slack thread',
            preview: '12 replies. Three emoji reactions. No owner.',
            reveal:
              'Nobody knows the acceptance criteria, priority, or whether it is still needed.',
          },
          {
            id: 'ticket',
            title: 'Work item',
            preview: 'Title · Problem · Acceptance · Owner · Priority',
            reveal:
              'The same ask becomes startable: a developer can pick it up tomorrow without decoding chat history.',
          },
        ]}
        onAllInvestigated={() => setStep(1)}
      />

      {step >= 1 && (
        <ChoiceQuestion
          prompt="What did the work item do that the Slack thread could not?"
          choices={[
            {
              id: 'hide',
              label: 'Hid the problem from leadership',
              wrongFeedback: 'Visibility is the point—not secrecy.',
            },
            {
              id: 'visible',
              label: 'Made the work visible and actionable',
              correct: true,
            },
            {
              id: 'code',
              label: 'Wrote the code automatically',
              wrongFeedback: 'A ticket organizes work; it does not implement it.',
            },
          ]}
          correctFeedback="Exactly. Visible work can be planned, owned, and finished."
          onCorrect={() => {
            setPain('relief')
            setStep(2)
            complete('ticket')
          }}
        />
      )}

      {step >= 2 && (
        <>
          <Insight concept="Work item (ticket)" toolIds={['jira', 'linear', 'githubIssues']}>
            A ticket turns a floating request into something a team can start, track, and
            close. Tools like Jira, Linear, or GitHub Issues are simply places that make that
            visibility durable.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('ticket')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
