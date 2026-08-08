import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { CodeBlank } from '../components/CodeBlank'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function ImplementKoan() {
  const { setPain, complete } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="implement"
      scenario={
        <>
          The ticket says: return the full name from first + last.
          <br />A test is already written. It is red. Your turn.
        </>
      }
    >
      <ZenQuote>
        Until the blank is filled,
        <br />
        the change is only a wish.
      </ZenQuote>

      <CodeBlank
        before={'function fullName(first, last) {\n  return '}
        after={'\n}'}
        placeholder="___"
        answers={[
          'first + " " + last',
          "first + ' ' + last",
          '`${first} ${last}`',
          'first + " " + last;',
          '`${first} ${last}`;',
        ]}
        testLabel="fullName('Ada', 'Lovelace') === 'Ada Lovelace'"
        hint="Join first, a space, and last."
        onPass={() => {
          setPain('relief')
          setStep(1)
        }}
      />

      {step >= 1 && (
        <ChoiceQuestion
          prompt="What just happened when the test turned green?"
          choices={[
            {
              id: 'deploy',
              label: 'The change went live for all users',
              wrongFeedback: 'Green tests prove the change locally—not that it shipped.',
            },
            {
              id: 'wrote',
              label: 'You wrote the change that satisfies the requirement',
              correct: true,
            },
            {
              id: 'ticket',
              label: 'The ticket closed itself',
              wrongFeedback: 'Implementation is a step—closing comes after the loop.',
            },
          ]}
          correctFeedback="Yes. Implementation is the act of writing the change."
          onCorrect={() => {
            setStep(2)
            complete('implement')
          }}
        />
      )}

      {step >= 2 && (
        <>
          <Insight
            concept="Implementation"
            toolIds={['vscode', 'cursor', 'claudeCode', 'openaiCodex', 'tests']}
          >
            Writing code is how intent becomes behavior. Editors and coding agents—VS Code,
            Cursor, Claude Code, OpenAI Codex—hold the change; a test runner tells you when
            the behavior matches the ask.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('implement')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
