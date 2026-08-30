import type { KnowledgeItem } from "@/types/knowledge"

/**
 * Knowledge.md 的层级格式：
 *
 * ## 【物理】
 *
 * ### 在珠穆朗玛峰顶，水约 71°C 就开了
 * 正文，可多行，空行分段。
 *
 * ### 光速是被「定义」出来的
 * 正文。
 *
 * 规则：
 * - `## 【学科】` / `## [学科]` 声明学科，它下面所有的 `###` 都归这个学科
 * - `### `（三个井号 + 空格）开始一条知识
 * - 单条想临时换学科，可以写 `### [化学] 标题`，优先级高于 `##`
 * - 没放在任何 `##` 下面的 `###`，归到「杂项」
 * - ``` 包裹的代码块整体跳过，方便在文件顶部写格式说明
 */

const DEFAULT_CATEGORY = "杂项"

const SECTION_RE = /^##\s+[【\[](.+?)[】\]]\s*$/
const HEADING_RE = /^###\s+(?:\[([^\]]*)\]\s*)?(.+?)\s*$/
const FENCE_RE = /^\s*```/

interface Draft {
  category: string
  title: string
  bodyLines: string[]
}

function buildBody(lines: string[]): string {
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function toItem(draft: Draft, index: number): KnowledgeItem {
  return {
    id: `k-${index}`,
    category: draft.category.trim() || DEFAULT_CATEGORY,
    title: draft.title.trim(),
    body: buildBody(draft.bodyLines),
  }
}

export function parseKnowledge(markdown: string): KnowledgeItem[] {
  const items: KnowledgeItem[] = []
  /** 当前 `##` 声明的学科 */
  let section: string | null = null
  let draft: Draft | null = null
  let inFence = false

  const flush = () => {
    if (draft) items.push(toItem(draft, items.length))
    draft = null
  }

  for (const line of markdown.split(/\r?\n/)) {
    if (FENCE_RE.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const sectionMatch = SECTION_RE.exec(line)
    if (sectionMatch) {
      flush()
      section = sectionMatch[1].trim() || DEFAULT_CATEGORY
      continue
    }

    const heading = HEADING_RE.exec(line)
    if (heading) {
      flush()
      draft = {
        // 标题上的 [学科] 优先，其次是当前 ##，最后兜底
        category: heading[1]?.trim() || section || DEFAULT_CATEGORY,
        title: heading[2] ?? "",
        bodyLines: [],
      }
      continue
    }

    if (!draft) continue

    draft.bodyLines.push(line)
  }

  flush()
  return items
}

/** 按出现顺序返回学科及其条目数量 */
export function collectCategories(items: KnowledgeItem[]): { name: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1)
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count }))
}
