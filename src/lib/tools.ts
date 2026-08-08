export type Tool = {
  id: string
  name: string
  role: string
  url: string
  /** Filename under public/tools/ (resolved with Vite BASE_URL) */
  logo?: string
  /** Label for tight spaces such as the delivery map nodes; falls back to `name` */
  short?: string
}

const TICKET_ROLE = 'The place work becomes visible and trackable'
const INTENT_ROLE = 'Where teams make intent visible and shareable'
const CI_ROLE = 'The automated pipeline that runs checks on every change'
const EDITOR_ROLE = 'Where developers write and edit the change'
const HUMAN_REVIEW_ROLE = 'Where humans leave feedback before integrate'
const AUTO_REVIEW_ROLE = 'Automated checks that catch quality, style, and security risks'
const MONITOR_ROLE = 'The eyes and ears on production after the ship'
const RUNTIME_ROLE = 'Where the change runs for users'

function toolLogo(file: string): string {
  return `${import.meta.env.BASE_URL}tools/${file}`
}

export const TOOLS: Record<string, Tool> = {
  figma: {
    id: 'figma',
    name: 'Figma',
    role: INTENT_ROLE,
    url: 'https://www.figma.com/',
    logo: toolLogo('figma.svg'),
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    role: INTENT_ROLE,
    url: 'https://www.notion.com/',
    logo: toolLogo('notion.svg'),
  },
  lucidchart: {
    id: 'lucidchart',
    name: 'Lucidchart',
    role: INTENT_ROLE,
    url: 'https://www.lucidchart.com/',
    logo: toolLogo('lucidchart.svg'),
  },
  miro: {
    id: 'miro',
    name: 'Miro',
    role: INTENT_ROLE,
    url: 'https://miro.com/',
    logo: toolLogo('miro.svg'),
  },
  jira: {
    id: 'jira',
    name: 'Jira',
    role: TICKET_ROLE,
    url: 'https://www.atlassian.com/software/jira',
    logo: toolLogo('jira.svg'),
  },
  linear: {
    id: 'linear',
    name: 'Linear',
    role: TICKET_ROLE,
    url: 'https://linear.app/',
    logo: toolLogo('linear.svg'),
  },
  githubIssues: {
    id: 'githubIssues',
    name: 'GitHub Issues',
    role: TICKET_ROLE,
    url: 'https://docs.github.com/en/issues',
    logo: toolLogo('github.svg'),
  },
  git: {
    id: 'git',
    name: 'Git',
    role: 'The tool that records and isolates every change',
    url: 'https://git-scm.com/',
    logo: toolLogo('git.svg'),
  },
  vscode: {
    id: 'vscode',
    name: 'VS Code',
    role: EDITOR_ROLE,
    url: 'https://code.visualstudio.com/',
    logo: toolLogo('vscode.svg'),
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    role: EDITOR_ROLE,
    url: 'https://cursor.com/',
    logo: toolLogo('cursor.svg'),
  },
  claudeCode: {
    id: 'claudeCode',
    name: 'Claude Code',
    role: EDITOR_ROLE,
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    logo: toolLogo('anthropic.svg'),
  },
  openaiCodex: {
    id: 'openaiCodex',
    name: 'OpenAI Codex',
    role: EDITOR_ROLE,
    url: 'https://openai.com/codex/',
    logo: toolLogo('openai.svg'),
  },
  tests: {
    id: 'tests',
    name: 'Test runner',
    role: 'The automated check that says “this still works”',
    url: 'https://jestjs.io/',
    logo: toolLogo('jest.svg'),
  },
  githubPr: {
    id: 'githubPr',
    name: 'GitHub Pull Requests',
    role: 'The proposal that asks others to take the change',
    url: 'https://docs.github.com/en/pull-requests',
    logo: toolLogo('github.svg'),
    short: 'GitHub',
  },
  githubReview: {
    id: 'githubReview',
    name: 'GitHub code review',
    role: HUMAN_REVIEW_ROLE,
    url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests',
    logo: toolLogo('github.svg'),
    short: 'GitHub',
  },
  sonarqube: {
    id: 'sonarqube',
    name: 'SonarQube',
    role: AUTO_REVIEW_ROLE,
    url: 'https://www.sonarsource.com/products/sonarqube/',
    logo: toolLogo('sonarqube.svg'),
  },
  snyk: {
    id: 'snyk',
    name: 'Snyk',
    role: AUTO_REVIEW_ROLE,
    url: 'https://snyk.io/',
    logo: toolLogo('snyk.svg'),
  },
  eslint: {
    id: 'eslint',
    name: 'ESLint',
    role: AUTO_REVIEW_ROLE,
    url: 'https://eslint.org/',
    logo: toolLogo('eslint.svg'),
  },
  githubActions: {
    id: 'githubActions',
    name: 'GitHub Actions',
    role: CI_ROLE,
    url: 'https://docs.github.com/en/actions',
    logo: toolLogo('github-actions.svg'),
    short: 'Actions',
  },
  jenkins: {
    id: 'jenkins',
    name: 'Jenkins',
    role: CI_ROLE,
    url: 'https://www.jenkins.io/',
    logo: toolLogo('jenkins.svg'),
  },
  circleci: {
    id: 'circleci',
    name: 'CircleCI',
    role: CI_ROLE,
    url: 'https://circleci.com/docs/',
    logo: toolLogo('circleci.svg'),
  },
  vercel: {
    id: 'vercel',
    name: 'Vercel',
    role: RUNTIME_ROLE,
    url: 'https://vercel.com/docs',
    logo: toolLogo('vercel.svg'),
  },
  harness: {
    id: 'harness',
    name: 'Harness',
    role: RUNTIME_ROLE,
    url: 'https://developer.harness.io/',
    logo: toolLogo('harness.svg'),
  },
  sentry: {
    id: 'sentry',
    name: 'Sentry',
    role: MONITOR_ROLE,
    url: 'https://sentry.io/',
    logo: toolLogo('sentry.svg'),
  },
  datadog: {
    id: 'datadog',
    name: 'Datadog',
    role: MONITOR_ROLE,
    url: 'https://www.datadoghq.com/',
    logo: toolLogo('datadog.svg'),
  },
  grafana: {
    id: 'grafana',
    name: 'Grafana',
    role: MONITOR_ROLE,
    url: 'https://grafana.com/',
    logo: toolLogo('grafana.svg'),
  },
}

export function getTools(ids: string[]): Tool[] {
  return ids.map((id) => TOOLS[id]).filter(Boolean)
}
