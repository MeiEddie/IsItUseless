export interface KnowledgeItem {
  /** 稳定 id，由解析顺序生成 */
  id: string
  /** 学科，来自 `## 【学科】`；单条可用 `### [学科] 标题` 覆盖；都没有时归为「杂项」 */
  category: string
  /** 标题 */
  title: string
  /** 正文，保留换行 */
  body: string
}
