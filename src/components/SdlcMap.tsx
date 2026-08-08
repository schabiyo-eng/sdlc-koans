import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MobileGate } from './MobileGate'
import { useProgress } from '../lib/ProgressContext'
import { getKoanMeta, KOAN_ORDER } from '../koans/registry'
import {
  ACTS,
  FLOW_EDGES,
  JOURNEY,
  LOOP_BACKS,
  SDLC_STEPS,
  SLOT_COUNT,
  type SdlcStep,
} from '../lib/sdlcMap'
import { TOOLS } from '../lib/tools'
import styles from './SdlcMap.module.css'

const CX = 310
const CY = 300
const R = 200
const NODE_R = 24
const LOGO_SIZE = 23
/** How far the forked review nodes sit inside and outside the ring */
const LANE = 56
const BASE_MS = 2600

function position(step: SdlcStep) {
  const angle = -Math.PI / 2 + (step.slot / SLOT_COUNT) * Math.PI * 2
  const radius = R + (step.lane ?? 0) * LANE
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  }
}

function stepBySlug(slug: string) {
  return SDLC_STEPS.find((s) => s.slug === slug)
}

function stepIndex(slug: string) {
  return SDLC_STEPS.findIndex((s) => s.slug === slug)
}

/** Loop-backs cut across the middle, so pull their endpoints in off the nodes. */
function arcPath(fromSlug: string, toSlug: string) {
  const from = stepBySlug(fromSlug)
  const to = stepBySlug(toSlug)
  if (!from || !to) return ''
  const a = position(from)
  const b = position(to)
  const pull = (p: { x: number; y: number }) => ({
    x: CX + (p.x - CX) * 0.86,
    y: CY + (p.y - CY) * 0.86,
  })
  const s = pull(a)
  const e = pull(b)
  return `M ${s.x} ${s.y} Q ${CX} ${CY} ${e.x} ${e.y}`
}

function edgeKey(from: string, to: string) {
  return `${from}>${to}`
}

/** Every step lit by a frame — parallel stages light together. */
function slugsAt(frame: number) {
  const f = JOURNEY[frame]
  return f.with ? [f.at, f.with] : [f.at]
}

/** How many times this step has been visited by the current frame — for "take N". */
function takeCount(frame: number) {
  const slug = JOURNEY[frame].at
  let n = 0
  for (let i = 0; i <= frame; i += 1) {
    if (JOURNEY[i].at === slug) n += 1
  }
  return n
}

export function SdlcMap() {
  const { progress } = useProgress()
  const pathDone = KOAN_ORDER.every((slug) => progress.completed.includes(slug))

  const [frame, setFrame] = useState(0)
  const [pinned, setPinned] = useState<number | null>(null)

  const nodes = useMemo(
    () =>
      SDLC_STEPS.map((step) => ({
        ...step,
        ...position(step),
        tool: TOOLS[step.icon],
      })),
    [],
  )

  // Re-schedule each frame with its own hold so beats can breathe and repeats rush.
  useEffect(() => {
    if (pinned !== null) return
    const hold = JOURNEY[frame].hold ?? 1
    const id = window.setTimeout(() => {
      setFrame((f) => (f + 1) % JOURNEY.length)
    }, BASE_MS * hold)
    return () => window.clearTimeout(id)
  }, [frame, pinned])

  const current = JOURNEY[frame]
  const activeSlugs = useMemo(() => new Set(slugsAt(frame)), [frame])
  const activeLoop = current.loop ?? null

  // Loop-backs sharing an origin collapse to one drawn arc.
  const loopPaths = useMemo(() => {
    const byPath = new Map<string, { d: string; indices: number[] }>()
    LOOP_BACKS.forEach((lb, i) => {
      const d = arcPath(lb.origin ?? lb.from, lb.to)
      const entry = byPath.get(d) ?? { d, indices: [] }
      entry.indices.push(i)
      byPath.set(d, entry)
    })
    return [...byPath.values()]
  }, [])

  // Forward edges light as the lap progresses and clear when it restarts.
  const litEdges = useMemo(() => {
    const lit = new Set<string>()
    for (let i = 1; i <= frame; i += 1) {
      if (JOURNEY[i].loop !== undefined) continue
      for (const from of slugsAt(i - 1)) {
        for (const to of slugsAt(i)) {
          lit.add(edgeKey(from, to))
        }
      }
    }
    return lit
  }, [frame])

  if (!pathDone) {
    const remaining = KOAN_ORDER.filter((slug) => !progress.completed.includes(slug))
    return (
      <>
        <MobileGate />
        <div className={styles.page}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Not yet</p>
            <h1 className={styles.title}>The map opens at the end</h1>
            <p className={styles.lede}>
              Finish every koan and the full delivery loop unlocks. Still to walk:
            </p>
          </header>
          <ul className={styles.remaining}>
            {remaining.map((slug) => (
              <li key={slug}>
                <Link to={`/koans/${slug}`}>{getKoanMeta(slug)?.title ?? slug}</Link>
              </li>
            ))}
          </ul>
          <div className={styles.footer}>
            <Link className={styles.home} to="/">
              Return home →
            </Link>
          </div>
        </div>
      </>
    )
  }

  const isPinnedView = pinned !== null
  const shownIdx = pinned ?? stepIndex(current.at)
  const step = SDLC_STEPS[shownIdx]
  const loop = !isPinnedView && activeLoop !== null ? LOOP_BACKS[activeLoop] : null
  const take = isPinnedView ? 1 : takeCount(frame)
  // The narration is the hero while the loop plays; a pinned step has no single
  // moment, so it falls back to the step's definition.
  const heroLine = isPinnedView ? step.blurb : current.line

  return (
    <>
      <MobileGate />
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Path complete</p>
          <h1 className={styles.title}>The delivery loop</h1>
          <p className={styles.lede}>
            One change, told start to finish—green when it moves forward, red when it returns.
            Tap any step to hold it.
          </p>
        </header>

        <div className={styles.acts}>
          {ACTS.map((act) => (
            <span
              key={act}
              className={`${styles.act} ${step.act === act ? styles.actLive : ''}`}
            >
              {act}
            </span>
          ))}
        </div>

        <div className={styles.layout}>
          <svg
            className={styles.svg}
            viewBox="0 0 620 620"
            role="img"
            aria-label="Software delivery lifecycle loop"
          >
            <circle className={styles.ring} cx={CX} cy={CY} r={R} />

            {FLOW_EDGES.map(({ from, to }) => {
              const a = nodes.find((n) => n.slug === from)
              const b = nodes.find((n) => n.slug === to)
              if (!a || !b) return null
              return (
                <line
                  key={edgeKey(from, to)}
                  className={`${styles.edge} ${
                    litEdges.has(edgeKey(from, to)) ? styles.edgeLit : ''
                  }`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
              )
            })}

            {loopPaths.map(({ d, indices }) => (
              <path
                key={d}
                className={`${styles.loop} ${
                  activeLoop !== null && indices.includes(activeLoop) ? styles.loopActive : ''
                }`}
                d={d}
              />
            ))}

            <text className={styles.centerLabel} x={CX} y={CY - 6} textAnchor="middle">
              SDLC
            </text>
            <text className={styles.centerSub} x={CX} y={CY + 16} textAnchor="middle">
              idea → users → again
            </text>

            {nodes.map((node, i) => {
              const isActive = activeSlugs.has(node.slug)
              const isPinnedNode = pinned === i
              const inLoop =
                activeLoop !== null &&
                (LOOP_BACKS[activeLoop].from === node.slug ||
                  LOOP_BACKS[activeLoop].to === node.slug)
              return (
                <g
                  key={node.slug}
                  className={[
                    styles.node,
                    isPinnedNode ? styles.nodePinned : '',
                    isActive && activeLoop === null ? styles.nodeLive : '',
                    isActive && activeLoop !== null ? styles.nodeFail : '',
                    !isActive && inLoop ? styles.nodeFailSoft : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setPinned(pinned === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setPinned(pinned === i ? null : i)
                    }
                  }}
                >
                  <title>
                    {node.label} — {node.tool.name}
                  </title>
                  <circle className={styles.halo} cx={node.x} cy={node.y} r={NODE_R} />
                  <circle className={styles.disc} cx={node.x} cy={node.y} r={NODE_R} />
                  <image
                    className={styles.nodeLogo}
                    href={node.tool.logo}
                    x={node.x - LOGO_SIZE / 2}
                    y={node.y - LOGO_SIZE / 2}
                    width={LOGO_SIZE}
                    height={LOGO_SIZE}
                  />
                  <text
                    className={styles.nodeLabel}
                    x={node.x}
                    y={node.y + NODE_R + 16}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                  <text
                    className={styles.nodeTool}
                    x={node.x}
                    y={node.y + NODE_R + 28}
                    textAnchor="middle"
                  >
                    {node.tool.short ?? node.tool.name}
                  </text>
                </g>
              )
            })}
          </svg>

          <section className={styles.detail} aria-live="polite">
            <p className={styles.detailStep}>
              Step {String(step.slot + 1).padStart(2, '0')} · {step.label}
              {take > 1 && <span className={styles.take}> · take {take}</span>}
            </p>

            {/* Keyed on frame so the narration cross-fades as the story advances. */}
            <p key={isPinnedView ? 'pinned' : frame} className={styles.hero}>
              {heroLine}
            </p>

            <span className={styles.concept}>{step.concept}</span>

            <p className={`${styles.status} ${loop ? styles.statusFail : ''}`}>
              {loop
                ? `Loop-back: ${loop.label} → ${loop.to}`
                : isPinnedView
                  ? 'Held. Tap the step again to resume the story.'
                  : 'Moving forward'}
            </p>
          </section>
        </div>

        <div className={styles.footer}>
          <Link className={styles.home} to="/">
            Return home →
          </Link>
        </div>
      </div>
    </>
  )
}
