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

export function ReviewKoan() {
  const { setPain, complete, visitLoop } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="review"
      scenario={
        <>
          A teammate opens your PR and leaves one comment on the new helper:
          <br />
          <em>“Please trim whitespace from first and last before joining.”</em>
        </>
      }
    >
      <ZenQuote>
        Another pair of eyes
        <br />
        is not delay—it is insurance.
      </ZenQuote>

      {step === 0 && (
        <InvestigatePanel
          cards={[
            {
              id: 'comment',
              title: 'Inline comment',
              preview: 'Line 3 · “Trim first and last.”',
              reveal: 'The change is not rejected—it is asked to improve.',
            },
            {
              id: 'decision',
              title: 'Review decision',
              preview: 'Changes requested',
              reveal: 'Merge waits. The path loops back to implementation.',
            },
          ]}
          onAllInvestigated={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <LoopBack
          trigger="Reviewer requested changes"
          detail="Human feedback found a gap. Delivery does not push forward—it returns to the code."
          targetLabel="Implement (fix the blank)"
          onAction={() => {
            visitLoop('review')
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
              'first.trim() + " " + last.trim()',
              "first.trim() + ' ' + last.trim()",
              '`${first.trim()} ${last.trim()}`',
            ]}
            testLabel="fullName('  Ada ', ' Lovelace ') === 'Ada Lovelace'"
            hint="Call .trim() on both parts before joining."
            onPass={() => {
              setPain('relief')
              setStep(3)
            }}
          />
        </div>
      )}

      {step >= 3 && step < 5 && (
        <ChoiceQuestion
          prompt="What did code review just do for the team?"
          choices={[
            {
              id: 'block',
              label: 'Blocked all progress forever',
              wrongFeedback: 'Review slows the merge—to speed trust.',
            },
            {
              id: 'feedback',
              label: 'Caught a gap before it reached the shared line',
              correct: true,
            },
            {
              id: 'deploy',
              label: 'Deployed the change automatically',
              wrongFeedback: 'Review judges; it does not ship.',
            },
          ]}
          correctFeedback="Yes. Feedback before integrate is the point of review."
          onCorrect={() => {
            setStep(4)
          }}
        />
      )}

      {step >= 4 && (
        <>
          <ZenQuote>
            Humans catch some gaps.
            <br />
            Machines refuse to forget the rest.
          </ZenQuote>

          <InvestigatePanel
            cards={[
              {
                id: 'human',
                title: 'Human judgment',
                preview: 'A teammate questions intent and design.',
                reveal: 'People notice context machines cannot see.',
              },
              {
                id: 'security',
                title: 'Dependency risk',
                preview: 'Known vulnerability in a package you imported.',
                reveal: 'Security findings block integrate until the risk is fixed.',
              },
              {
                id: 'quality',
                title: 'Automated finding',
                preview: 'A rule flags a smell or style break.',
                reveal: 'Quality and lint checks keep every change consistent.',
              },
            ]}
            onAllInvestigated={() => {
              setPain('friction')
              setStep(5)
            }}
          />
        </>
      )}

      {step >= 5 && (
        <ChoiceQuestion
          prompt="Why also let automated checks review the change?"
          choices={[
            {
              id: 'replace',
              label: 'So humans never have to review again',
              wrongFeedback: 'Machines assist review—they do not replace judgment.',
            },
            {
              id: 'consistent',
              label: 'To catch security, quality, and style risks humans miss consistently',
              correct: true,
            },
            {
              id: 'optional',
              label: 'Only when the team feels unsure',
              wrongFeedback: 'Confidence is not a substitute for a failing check.',
            },
          ]}
          correctFeedback="Yes. Automated review is consistent insurance beside human eyes."
          onCorrect={() => {
            setPain('relief')
            setStep(6)
            complete('review')
          }}
        />
      )}

      {step >= 6 && (
        <>
          <Insight
            concept="Code review and automated checks"
            toolIds={['githubReview', 'sonarqube', 'snyk', 'eslint']}
          >
            Review is human judgment on a proposed change. Automated checks—SonarQube for
            quality, Snyk for security, ESLint for style—catch risks people miss the same way
            every time. When either fails, the loop returns to implement.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('review')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
