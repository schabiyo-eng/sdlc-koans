import { useEffect, useState } from 'react'
import { ChoiceQuestion } from '../components/ChoiceQuestion'
import { ContinueLink } from '../components/ContinueLink'
import { Insight } from '../components/Insight'
import { InvestigatePanel } from '../components/InvestigatePanel'
import { KoanShell } from '../components/KoanShell'
import { ZenQuote } from '../components/ZenQuote'
import { useProgress } from '../lib/ProgressContext'
import { nextSlug } from './registry'

export function MergeKoan() {
  const { setPain, complete } = useProgress()
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    setPain('friction')
  }, [setPain])

  const options = [
    {
      id: 'yours',
      label: 'return first + " " + last;  // yours only',
      ok: false,
    },
    {
      id: 'theirs',
      label: 'return last + ", " + first;  // theirs only',
      ok: false,
    },
    {
      id: 'both',
      label: 'return [first, last].map(s => s.trim()).filter(Boolean).join(" ");',
      ok: true,
    },
  ]

  return (
    <KoanShell
      slug="merge"
      scenario={
        <>
          Checks are green. Review is approved.
          <br />
          While you worked, a teammate also touched <span className="mono">fullName</span>.
          Git stops you with a conflict.
        </>
      }
    >
      <ZenQuote>
        Two truths cannot share one line
        <br />
        until someone chooses carefully.
      </ZenQuote>

      <InvestigatePanel
        cards={[
          {
            id: 'conflict',
            title: 'Conflict markers',
            preview: (
              <span className="mono">
                &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
                <br />
                your change
                <br />
                =======
                <br />
                their change
                <br />
                &gt;&gt;&gt;&gt;&gt;&gt;&gt; main
              </span>
            ),
            reveal: 'Neither side wins automatically. A human must reconcile.',
          },
        ]}
        onAllInvestigated={() => setStep(1)}
      />

      {step >= 1 && (
        <div className="fade-up" style={{ maxWidth: '38rem', margin: '0 auto 1.25rem' }}>
          <p style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            Which result should land on the shared line?
          </p>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="mono"
                style={{
                  textAlign: 'left',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '0.4rem',
                  border: `1px solid ${
                    picked === opt.id
                      ? opt.ok
                        ? 'var(--pass)'
                        : 'var(--fail)'
                      : 'var(--border-strong)'
                  }`,
                  background:
                    picked === opt.id
                      ? opt.ok
                        ? 'var(--pass-soft)'
                        : 'var(--fail-soft)'
                      : 'rgba(255,255,255,0.65)',
                  cursor: picked && opt.ok ? 'default' : 'pointer',
                }}
                disabled={Boolean(picked && options.find((o) => o.id === picked)?.ok)}
                onClick={() => {
                  setPicked(opt.id)
                  if (opt.ok) {
                    setPain('relief')
                    setStep(2)
                  } else {
                    setPain('friction')
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {picked && !options.find((o) => o.id === picked)?.ok && (
            <p
              className="mono"
              style={{
                textAlign: 'center',
                color: 'var(--fail)',
                marginTop: '0.6rem',
                fontSize: '0.85rem',
              }}
            >
              That drops the other person’s intent. Keep both truths where you can.
            </p>
          )}
        </div>
      )}

      {step >= 2 && (
        <ChoiceQuestion
          prompt="What does a successful merge mean?"
          choices={[
            {
              id: 'delete',
              label: 'The feature branch is the only history left',
              wrongFeedback: 'Merge integrates—it does not erase how you got there.',
            },
            {
              id: 'integrate',
              label: 'The change now lives on the shared line',
              correct: true,
            },
            {
              id: 'users',
              label: 'All users already have the change',
              wrongFeedback: 'Merged ≠ deployed. Shipping is still ahead.',
            },
          ]}
          correctFeedback="Yes. Merge integrates the approved change into main."
          onCorrect={() => {
            setStep(3)
            complete('merge')
          }}
        />
      )}

      {step >= 3 && (
        <>
          <Insight concept="Merge" toolIds={['git', 'githubPr']}>
            Merge joins an isolated change back into the shared line. Conflicts are the
            pain of parallel work—and the reason isolation existed in the first place.
          </Insight>
          <ContinueLink to={`/koans/${nextSlug('merge')}`} label="Continue" />
        </>
      )}
    </KoanShell>
  )
}
