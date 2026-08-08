export type Act = 'Decide' | 'Build' | 'Ship'

export type SdlcStep = {
  slug: string
  label: string
  concept: string
  blurb: string
  act: Act
  /** Tool id whose mark stands in for this step on the ring */
  icon: string
  /** Angular position. Steps that run in parallel share a slot. */
  slot: number
  /** Radial offset from the ring: -1 inside, 1 outside. Omitted means on the ring. */
  lane?: -1 | 1
}

/** Number of angular positions — fewer than SDLC_STEPS because review forks in two. */
export const SLOT_COUNT = 11

/** Delivery stages only — the-loop *is* the map, not a node on it. */
export const SDLC_STEPS: SdlcStep[] = [
  {
    slug: 'idea',
    label: 'Idea',
    concept: 'Shared intent',
    blurb: 'Until the team can say the same problem, every delivery is a surprise.',
    act: 'Decide',
    icon: 'figma',
    slot: 0,
  },
  {
    slug: 'ticket',
    label: 'Ticket',
    concept: 'Work item',
    blurb: 'A ticket turns a floating ask into something the team can start, track, and close.',
    act: 'Decide',
    icon: 'jira',
    slot: 1,
  },
  {
    slug: 'branch',
    label: 'Branch',
    concept: 'Branch & worktree',
    blurb: 'Isolate the change on its own line—and a second folder when two lines must stay open.',
    act: 'Build',
    icon: 'git',
    slot: 2,
  },
  {
    slug: 'implement',
    label: 'Implement',
    concept: 'Implementation',
    blurb: 'Writing code is how intent becomes behavior, verified by tests.',
    act: 'Build',
    icon: 'cursor',
    slot: 3,
  },
  {
    slug: 'commit',
    label: 'Commit',
    concept: 'Commit',
    blurb: 'A commit records a meaningful slice of the change in history.',
    act: 'Build',
    icon: 'git',
    slot: 4,
  },
  {
    slug: 'pull-request',
    label: 'Pull request',
    concept: 'Pull request',
    blurb: 'A PR proposes merging your line back into the shared path.',
    act: 'Build',
    icon: 'githubPr',
    slot: 5,
  },
  {
    slug: 'review',
    label: 'Human review',
    concept: 'Code review',
    blurb: 'A teammate judges intent: is this the right change, and will the next reader follow it?',
    act: 'Build',
    icon: 'githubReview',
    slot: 6,
    lane: -1,
  },
  {
    slug: 'review-auto',
    label: 'Auto review',
    concept: 'Automated & security review',
    blurb:
      'Scanners read every line for bugs, style, and known vulnerabilities—before a human spends attention on it.',
    act: 'Build',
    icon: 'sonarqube',
    slot: 6,
    lane: 1,
  },
  {
    slug: 'ci',
    label: 'CI',
    concept: 'Continuous integration',
    blurb: 'Machines run the same checks on every change before the shared line accepts it.',
    act: 'Build',
    icon: 'githubActions',
    slot: 7,
  },
  {
    slug: 'merge',
    label: 'Merge',
    concept: 'Merge',
    blurb: 'Merge joins the isolated line into the shared history.',
    act: 'Build',
    icon: 'githubPr',
    slot: 8,
  },
  {
    slug: 'deploy',
    label: 'Deploy',
    concept: 'Deploy',
    blurb: 'Deploy is how merged work becomes reachable in a runtime users feel.',
    act: 'Ship',
    icon: 'vercel',
    slot: 9,
  },
  {
    slug: 'monitor',
    label: 'Monitor',
    concept: 'Monitoring',
    blurb: 'Listening after the ship turns silent failures into the next ticket.',
    act: 'Ship',
    icon: 'sentry',
    slot: 10,
  },
]

export const ACTS: Act[] = ['Decide', 'Build', 'Ship']

/**
 * Forward flow. A pull request fans out to both kinds of review, and both must
 * clear before the two lines rejoin at CI.
 */
export const FLOW_EDGES: { from: string; to: string }[] = [
  { from: 'idea', to: 'ticket' },
  { from: 'ticket', to: 'branch' },
  { from: 'branch', to: 'implement' },
  { from: 'implement', to: 'commit' },
  { from: 'commit', to: 'pull-request' },
  { from: 'pull-request', to: 'review' },
  { from: 'pull-request', to: 'review-auto' },
  { from: 'review', to: 'ci' },
  { from: 'review-auto', to: 'ci' },
  { from: 'ci', to: 'merge' },
  { from: 'merge', to: 'deploy' },
  { from: 'deploy', to: 'monitor' },
  { from: 'monitor', to: 'idea' },
]

export type LoopBack = {
  from: string
  to: string
  label: string
  /**
   * Draw the arc from this step instead of `from`. Both kinds of review share one
   * return road — an arc out of the outer node would have to cut straight through
   * the inner one to reach the middle.
   */
  origin?: string
}

export const LOOP_BACKS: LoopBack[] = [
  { from: 'review', to: 'implement', label: 'changes requested' },
  { from: 'review-auto', to: 'implement', label: 'scanner flags a risk', origin: 'review' },
  { from: 'ci', to: 'implement', label: 'checks red' },
  { from: 'monitor', to: 'ticket', label: 'defect found' },
]

export type JourneyFrame = {
  at: string
  /** Second step lit at the same time, for stages that run in parallel */
  with?: string
  /** Index into LOOP_BACKS when this frame is a failure returning to an earlier step */
  loop?: number
  /** One sentence of narration, second person, present tense */
  line: string
  /** Multiplier on the base frame duration — long for beats that matter, short for montage */
  hold?: number
}

/**
 * One continuous lap told as a story: three attempts to get past review and CI,
 * then a production defect that reopens the board. Loops forever so both paths are
 * visible without the learner choosing one. The prose is written to read as
 * continuous narration; `hold` controls the rhythm (long beats vs. montage).
 */
export const JOURNEY: JourneyFrame[] = [
  { at: 'idea', line: 'Someone notices a problem worth solving.' },
  { at: 'ticket', line: 'It gets a name, an owner, and a place on the board.' },
  { at: 'branch', line: 'You step off the shared line, so nothing you break is theirs.' },
  { at: 'implement', line: 'You write the change — and a test that proves it.' },
  { at: 'commit', line: 'You save a slice of it to history, with a note for whoever reads it next.' },
  { at: 'pull-request', line: 'You offer it back. Here is my line; may it join yours?' },
  {
    at: 'review',
    with: 'review-auto',
    line: 'Two readers pick it up at once — a teammate, and a machine.',
    hold: 1.4,
  },
  {
    at: 'implement',
    loop: 0,
    line: 'The teammate wants it clearer. You write it again, differently.',
    hold: 1.5,
  },
  { at: 'commit', line: 'Another slice.', hold: 0.7 },
  { at: 'pull-request', line: 'You offer it again.', hold: 0.7 },
  {
    at: 'review-auto',
    with: 'review',
    line: 'The teammate is satisfied. The scanner is not.',
    hold: 1.4,
  },
  {
    at: 'implement',
    loop: 1,
    line: 'A library it leans on has a known hole. Back you go.',
    hold: 1.5,
  },
  { at: 'commit', line: 'Another slice.', hold: 0.7 },
  { at: 'pull-request', line: 'You offer it again.', hold: 0.7 },
  {
    at: 'review',
    with: 'review-auto',
    line: 'This time both readers agree, and the two lines rejoin.',
    hold: 1.2,
  },
  { at: 'ci', line: 'Then the machines build the whole thing — and a check comes back red.', hold: 1.4 },
  { at: 'implement', loop: 2, line: 'Back again. The build does not negotiate.', hold: 1.5 },
  { at: 'commit', line: 'Another slice.', hold: 0.7 },
  { at: 'pull-request', line: 'You offer it again.', hold: 0.7 },
  { at: 'review', with: 'review-auto', line: 'Approved, twice over.', hold: 0.8 },
  { at: 'ci', line: 'Green.', hold: 0.9 },
  { at: 'merge', line: 'Your line becomes the shared line. The branch disappears.' },
  { at: 'deploy', line: 'The change reaches a runtime where users can feel it.' },
  { at: 'monitor', line: 'And you watch. Days pass. Then something breaks in the dark.', hold: 1.5 },
  {
    at: 'ticket',
    loop: 3,
    line: 'Which is just a problem worth solving. The loop begins again.',
    hold: 1.7,
  },
]
