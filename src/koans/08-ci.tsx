import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { CodeBlank } from '../components/CodeBlank'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { LoopBack } from '../components/LoopBack'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function CiKoan() {
  const { setPain, complete, visitLoop } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="ci"
      scenario={
        <>
          Humans approved the PR. Then the pipeline ran.
          <br />
          One check is red. Merge is blocked.
        </>
      }
    >
      <ZenQuote>
        What humans forget to re-check,
        <br />
        machines can refuse to forget.
      </ZenQuote>

      {step === 0 && (
        <InvestigatePanel
          cards={[
            {
              id: 'log',
              title: 'CI log',
              preview: (
                <span className="mono">
                  ✗ test fullName handles empty last
                  <br />
                  Expected &quot;Ada&quot; · Received &quot;Ada &quot;
                </span>
              ),
              reveal: 'A trailing space when last is empty. Merge stays closed.',
            },
            {
              id: 'gate',
              title: 'Merge gate',
              preview: 'Required checks: 1 failing',
              reveal: 'The shared line will not take a change the machines reject.',
            },
          ]}
          onAllInvestigated={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <LoopBack
          trigger="CI failed: 1 test red"
          detail="Automated checks found a defect humans missed. The path returns to the code—not to production."
          targetLabel="Implement (fix the blank)"
          onAction={() => {
            visitLoop('ci')
            setPain('friction')
            setStep(2)
          }}
        />
      )}

      {step >= 2 && step < 4 && (
        <div style={{ marginTop: '1rem' }}>
          <CodeBlank
            before={'function fullName(first, last) {\n  return '}
            after={'\n}'}
            placeholder="___"
            answers={[
              '[first, last].map(s => s.trim()).filter(Boolean).join(" ")',
              "[first, last].map(s => s.trim()).filter(Boolean).join(' ')",
              '[first.trim(), last.trim()].filter(Boolean).join(" ")',
              "[first.trim(), last.trim()].filter(Boolean).join(' ')",
            ]}
            testLabel="fullName('Ada', '') === 'Ada'  &&  fullName('Ada','Lovelace') === 'Ada Lovelace'"
            hint="Trim, drop empty parts, then join with a space."
            answerTip={'[first, last].map(s => s.trim()).filter(Boolean).join(" ")'}
            onPass={() => {
              setPain('relief')
              setStep(3)
            }}
          />
        </div>
      )}

      {step >= 3 && (
        <ChoiceQuestion
          prompt="Why let CI block the merge?"
          choices={[
            {
              id: 'slow',
              label: 'To slow developers down for sport',
              wrongFeedback: 'The gate protects the shared line—not egos.',
            },
            {
              id: 'auto',
              label: 'So every change is checked the same way, every time',
              correct: true,
            },
            {
              id: 'skip',
              label: 'CI is optional if you feel confident',
              wrongFeedback: 'Confidence is not a substitute for a failing test.',
            },
          ]}
          correctFeedback="Yes. Continuous integration is consistent, automated verification."
          onCorrect={() => {
            setStep(4)
            complete('ci')
          }}
        />
      )}

      {step >= 4 && (
        <>
          <Insight
            concept="Continuous integration (CI)"
            toolIds={['githubActions', 'jenkins', 'circleci']}
          >
            CI is the automated pipeline that runs the same checks on every proposed
            change. Red means loop back to implement; green means the shared line may
            accept the work. Teams run that pipeline in tools like GitHub Actions,
            Jenkins, or CircleCI.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('ci')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
