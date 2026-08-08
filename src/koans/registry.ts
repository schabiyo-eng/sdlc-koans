import type { ComponentType } from 'react'
import { IdeaKoan } from './01-idea'
import { TicketKoan } from './02-ticket'
import { BranchKoan } from './03-branch'
import { ImplementKoan } from './04-implement'
import { CommitKoan } from './05-commit'
import { PullRequestKoan } from './06-pull-request'
import { ReviewKoan } from './07-review'
import { CiKoan } from './08-ci'
import { MergeKoan } from './09-merge'
import { DeployKoan } from './10-deploy'
import { MonitorKoan } from './11-monitor'
import { TheLoopKoan } from './12-the-loop'

export type KoanMeta = {
  slug: string
  title: string
  toolIds: string[]
  Component: ComponentType
}

export const KOANS: KoanMeta[] = [
  {
    slug: 'idea',
    title: 'The vague ask',
    toolIds: ['figma', 'notion', 'lucidchart', 'miro'],
    Component: IdeaKoan,
  },
  {
    slug: 'ticket',
    title: 'Making work visible',
    toolIds: ['jira', 'linear', 'githubIssues'],
    Component: TicketKoan,
  },
  {
    slug: 'branch',
    title: 'A safe place to change',
    toolIds: ['git'],
    Component: BranchKoan,
  },
  {
    slug: 'implement',
    title: 'Writing the change',
    toolIds: ['vscode', 'cursor', 'claudeCode', 'openaiCodex', 'tests'],
    Component: ImplementKoan,
  },
  {
    slug: 'commit',
    title: 'Recording the change',
    toolIds: ['git'],
    Component: CommitKoan,
  },
  {
    slug: 'pull-request',
    title: 'Proposing the change',
    toolIds: ['githubPr'],
    Component: PullRequestKoan,
  },
  {
    slug: 'review',
    title: 'Another pair of eyes',
    toolIds: ['githubReview', 'sonarqube', 'snyk', 'eslint'],
    Component: ReviewKoan,
  },
  {
    slug: 'ci',
    title: 'Machines check too',
    toolIds: ['githubActions', 'jenkins', 'circleci'],
    Component: CiKoan,
  },
  {
    slug: 'merge',
    title: 'Joining the shared line',
    toolIds: ['git', 'githubPr'],
    Component: MergeKoan,
  },
  {
    slug: 'deploy',
    title: 'Reaching users',
    toolIds: ['vercel', 'harness'],
    Component: DeployKoan,
  },
  {
    slug: 'monitor',
    title: 'Listening after the ship',
    toolIds: ['sentry', 'datadog', 'grafana'],
    Component: MonitorKoan,
  },
  {
    slug: 'the-loop',
    title: 'The path is a circle',
    toolIds: [],
    Component: TheLoopKoan,
  },
]

export const KOAN_ORDER = KOANS.map((k) => k.slug)

export function getKoanMeta(slug: string) {
  return KOANS.find((k) => k.slug === slug)
}

export function nextSlug(slug: string): string | null {
  const idx = KOAN_ORDER.indexOf(slug)
  if (idx < 0 || idx >= KOAN_ORDER.length - 1) return null
  return KOAN_ORDER[idx + 1]
}
