import { getTools } from '../lib/tools'
import styles from './ToolChip.module.css'

export function ToolChips({ ids }: { ids: string[] }) {
  const tools = getTools(ids)
  if (!tools.length) return null

  const groups = tools.reduce<Map<string, typeof tools>>((result, tool) => {
    const group = result.get(tool.role) ?? []
    group.push(tool)
    result.set(tool.role, group)
    return result
  }, new Map())

  return (
    <div className={styles.card}>
      {[...groups].map(([role, roleTools]) => (
        <div key={role} className={styles.group}>
          <span className={styles.role}>{role}</span>
          <div className={styles.tools}>
            {roleTools.map((tool) => (
              <a
                key={tool.id}
                className={styles.tool}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
              >
                {tool.logo && (
                  <img className={styles.logo} src={tool.logo} alt="" aria-hidden="true" />
                )}
                <span className={styles.name}>{tool.name}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
