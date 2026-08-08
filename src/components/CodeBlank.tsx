import { useRef, useState } from 'react'
import styles from './CodeBlank.module.css'

type Props = {
  before: string
  after: string
  placeholder?: string
  /** Acceptable answers (case-insensitive, trimmed) */
  answers: string[]
  testLabel: string
  onPass: () => void
  hint?: string
  /** Opt-in: fills this accepted answer into the blank when the learner asks */
  answerTip?: string
}

export function CodeBlank({
  before,
  after,
  placeholder = '___',
  answers,
  testLabel,
  onPass,
  hint,
  answerTip,
}: Props) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'fail' | 'pass'>('idle')
  // `status` is stale within a tick, so held Enter or a double click could advance
  // the koan more than once.
  const passed = useRef(false)

  function run() {
    if (passed.current) return
    const normalized = value.trim().toLowerCase().replace(/;$/, '')
    const ok = answers.some((a) => a.trim().toLowerCase().replace(/;$/, '') === normalized)
    if (ok) {
      passed.current = true
      setStatus('pass')
      onPass()
    } else {
      setStatus('fail')
    }
  }

  function useTip() {
    if (!answerTip || status === 'pass') return
    setValue(answerTip)
    if (status !== 'idle') setStatus('idle')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.editor} aria-label="Code editor">
        <div className={styles.line}>
          {before}
          <input
            className={styles.blank}
            value={value}
            placeholder={placeholder}
            size={Math.max(value.length, placeholder.length) + 1}
            onChange={(e) => {
              setValue(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') run()
            }}
            spellCheck={false}
            disabled={status === 'pass'}
            aria-label="Fill in the blank"
          />
          {after}
        </div>
      </div>

      <div
        className={`${styles.test} ${
          status === 'pass' ? styles.pass : status === 'fail' ? styles.fail : ''
        }`}
      >
        <span>{testLabel}</span>
        <span>
          {status === 'pass' ? 'PASS' : status === 'fail' ? 'FAIL' : 'NOT RUN'}
        </span>
      </div>

      {status !== 'pass' && (
        <div className={styles.actions}>
          <button type="button" className={styles.run} onClick={run}>
            Run test
          </button>
          {answerTip && (
            <button type="button" className={styles.tip} onClick={useTip}>
              Need a tip?
            </button>
          )}
        </div>
      )}
      {status === 'fail' && hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}
