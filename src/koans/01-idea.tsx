import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function IdeaKoan() {
  const { setPain, complete } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="idea"
      scenario={
        <>
          Someone says: <em>“Can we just add a button that does the thing?”</em>
          <br />
          Three people hear three different things.
        </>
      }
    >
      <ZenQuote>
        Where there is no shared intent,
        <br />
        every delivery is a surprise.
      </ZenQuote>

      <InvestigatePanel
        cards={[
          {
            id: 'pm',
            title: 'Product',
            preview: '“The button should open checkout.”',
            reveal: 'They meant a full purchase flow.',
          },
          {
            id: 'design',
            title: 'Design',
            preview: '“The button should match the new brand.”',
            reveal: 'They meant a visual refresh across the page.',
          },
          {
            id: 'eng',
            title: 'Engineering',
            preview: '“The button should call the API.”',
            reveal: 'They meant a tiny wiring change—nothing more.',
          },
        ]}
        onAllInvestigated={() => setStep(1)}
      />

      {step >= 1 && (
        <ChoiceQuestion
          prompt="What is missing before anyone should start building?"
          choices={[
            {
              id: 'code',
              label: 'More code',
              wrongFeedback: 'Code without agreement multiplies the confusion.',
            },
            {
              id: 'intent',
              label: 'A shared problem statement',
              correct: true,
            },
            {
              id: 'meeting',
              label: 'Another status meeting',
              wrongFeedback: 'Meetings help—but only if they produce shared intent.',
            },
          ]}
          correctFeedback="Yes. Until the problem is shared, the work cannot be."
          onCorrect={() => {
            setPain('relief')
            setStep(2)
            complete('idea')
          }}
        />
      )}

      {step >= 2 && (
        <>
          <Insight
            concept="Shared intent"
            toolIds={['figma', 'notion', 'lucidchart', 'miro']}
          >
            An idea becomes useful when the team can say the same problem in the same
            words. That is the start of the path. Without it: more meetings, more
            rewrites, more “that’s not what I meant.”
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('idea')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
