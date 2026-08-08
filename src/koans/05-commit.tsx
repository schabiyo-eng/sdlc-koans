import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function CommitKoan() {
  const { setPain, complete } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="commit"
      scenario={
        <>
          You changed twelve files. Tomorrow someone will ask:
          <br />
          <em>“What exactly changed—and why?”</em>
        </>
      }
    >
      <ZenQuote>
        A change unspoken is a change unowned.
      </ZenQuote>

      <InvestigatePanel
        cards={[
          {
            id: 'blob',
            title: 'One giant commit',
            preview: 'Message: “stuff” · 12 files · no story',
            reveal: 'Impossible to review, revert, or explain six weeks later.',
          },
          {
            id: 'atomic',
            title: 'Small commits',
            preview: '“Add fullName helper” · “Wire checkout button”',
            reveal: 'Each step has a reason. History becomes a narrative.',
          },
        ]}
        onAllInvestigated={() => setStep(1)}
      />

      {step >= 1 && (
        <ChoiceQuestion
          prompt="What is a commit, really?"
          choices={[
            {
              id: 'backup',
              label: 'A random backup of the laptop',
              wrongFeedback: 'Commits are intentional records—not automatic backups.',
            },
            {
              id: 'atomic',
              label: 'An atomic, explained snapshot of a change',
              correct: true,
            },
            {
              id: 'deploy',
              label: 'A production deploy',
              wrongFeedback: 'Committing records history; deploying ships to users.',
            },
          ]}
          correctFeedback="Yes. A commit freezes a meaningful step with a message."
          onCorrect={() => {
            setPain('relief')
            setStep(2)
            complete('commit')
          }}
        />
      )}

      {step >= 2 && (
        <>
          <Insight concept="Commit" toolIds={['git']}>
            Commits are the diary of the change. Small, clear commits make review,
            rollback, and learning possible.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('commit')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
