import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function BranchKoan() {
  const { setPain, complete } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="branch"
      scenario={
        <>
          Two developers need to change the same product today.
          <br />
          Only one of them can safely edit the shared line at a time—unless…
        </>
      }
    >
      <ZenQuote>
        Fear of breaking the shared path
        <br />
        is why work walks beside it first.
      </ZenQuote>

      <InvestigatePanel
        cards={[
          {
            id: 'main',
            title: 'main',
            preview: 'The shared line everyone ships from.',
            reveal: 'If both people edit here at once, finished work collides.',
          },
          {
            id: 'branch',
            title: 'feature/checkout-fix',
            preview: 'A private copy of the path for one change.',
            reveal: 'Experiments live here until they are ready to rejoin main.',
          },
        ]}
        onAllInvestigated={() => setStep(1)}
      />

      {step >= 1 && (
        <ChoiceQuestion
          prompt="Why create a branch before writing the change?"
          choices={[
            {
              id: 'hide',
              label: 'To hide work from the team forever',
              wrongFeedback: 'Branches are temporary isolation—not secrecy.',
            },
            {
              id: 'isolate',
              label: 'To isolate the change until it is ready',
              correct: true,
            },
            {
              id: 'deploy',
              label: 'To deploy immediately to production',
              wrongFeedback: 'Branches protect main; they are not a deploy.',
            },
          ]}
          correctFeedback="Yes. Isolation lets you change without breaking everyone else."
          onCorrect={() => {
            setPain('relief')
            setStep(2)
          }}
        />
      )}

      {step >= 2 && (
        <>
          <ZenQuote>
            Half-finished work fills one desk.
            <br />
            An urgent fix asks for the same desk.
          </ZenQuote>

          <InvestigatePanel
            cards={[
              {
                id: 'one-folder',
                title: 'One working folder',
                preview: 'The checkout change is open when an urgent fix arrives.',
                reveal:
                  'Switching lines means pausing, stashing, and later rebuilding your context.',
              },
              {
                id: 'two-folders',
                title: 'Two working folders',
                preview: 'The urgent fix opens beside the unfinished change.',
                reveal: 'Each line stays checked out, with its files and tools ready.',
              },
            ]}
            onAllInvestigated={() => {
              setPain('friction')
              setStep(3)
            }}
          />
        </>
      )}

      {step >= 3 && (
        <ChoiceQuestion
          prompt="Why give the urgent fix its own working folder?"
          choices={[
            {
              id: 'duplicate-history',
              label: 'To create a second copy of the repository history',
              wrongFeedback:
                'Both folders share the same Git history; they expose different lines of work.',
            },
            {
              id: 'parallel-context',
              label: 'To keep both lines usable without switching the same folder',
              correct: true,
            },
            {
              id: 'skip-review',
              label: 'To let the urgent fix bypass review',
              wrongFeedback:
                'A separate folder changes where work happens, not how it is reviewed.',
            },
          ]}
          correctFeedback="Yes. Each line keeps its own files and working context."
          onCorrect={() => {
            setPain('relief')
            setStep(4)
            complete('branch')
          }}
        />
      )}

      {step >= 4 && (
        <>
          <Insight concept="Branch and worktree" toolIds={['git']}>
            A branch isolates a line of work. A Git worktree gives another branch its own
            checked-out folder, so both can stay open at once. Git creates and tracks both
            until the lines rejoin the shared path.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('branch')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
