import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function PullRequestKoan() {
  const { setPain, complete } = useProgress()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  return (
    <KoanShell
      slug="pull-request"
      scenario={
        <>
          It works on your machine. The shared line still does not have it.
          <br />
          How do you ask the team to take the change?
        </>
      }
    >
      <ZenQuote>
        A change kept private
        <br />
        has not yet asked to matter.
      </ZenQuote>

      <InvestigatePanel
        cards={[
          {
            id: 'diff',
            title: 'The diff',
            preview: (
              <span className="mono">
                + return first + &quot; &quot; + last;
              </span>
            ),
            reveal: 'Reviewers see exactly what will change on the shared line.',
          },
          {
            id: 'desc',
            title: 'The proposal',
            preview: 'Why · What · How to test',
            reveal: 'Context turns a pile of lines into a request for judgment.',
          },
        ]}
        onAllInvestigated={() => setStep(1)}
      />

      {step >= 1 && (
        <ChoiceQuestion
          prompt="What is a pull request for?"
          choices={[
            {
              id: 'secret',
              label: 'Hiding work until release day',
              wrongFeedback: 'PRs expose work so others can judge it.',
            },
            {
              id: 'propose',
              label: 'Proposing a change for others to review and accept',
              correct: true,
            },
            {
              id: 'delete',
              label: 'Deleting the branch permanently',
              wrongFeedback: 'Opening a PR starts conversation—not deletion.',
            },
          ]}
          correctFeedback="Yes. A PR is a formal ask: please take this change."
          onCorrect={() => {
            setPain('relief')
            setStep(2)
            complete('pull-request')
          }}
        />
      )}

      {step >= 2 && (
        <>
          <Insight concept="Pull request" toolIds={['githubPr']}>
            A pull request proposes merging your branch into the shared line. GitHub PRs
            (and similar tools) package the diff, description, and discussion in one
            place.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('pull-request')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
