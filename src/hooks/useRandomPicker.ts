import { useCallback, useState } from "react"

/** Fisher–Yates 洗牌，返回 [0, n) 的随机顺序 */
function shuffled(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = order[i]
    order[i] = order[j]
    order[j] = tmp
  }
  return order
}

interface PickerState<T> {
  pool: T[]
  /** pool 的指纹，用于判断是否需要重置 */
  key: string
  order: number[]
  cursor: number
  seen: Set<string>
}

interface Picker<T> {
  current: T | null
  /** 当前这一轮已经抽到的数量 */
  seenCount: number
  total: number
  /** 本轮是否已经全部抽完 */
  exhausted: boolean
  draw: () => void
}

interface Identifiable {
  id: string
}

function createState<T extends Identifiable>(pool: T[]): PickerState<T> {
  const order = shuffled(pool.length)
  const seen = new Set<string>()
  if (pool.length > 0) seen.add(pool[order[0]].id)

  return {
    pool,
    key: pool.map((item) => item.id).join("|"),
    order,
    cursor: pool.length > 0 ? 0 : -1,
    seen,
  }
}

/**
 * 「洗牌袋」随机抽取：把条目打乱后依次发牌，一轮之内不重复；
 * 抽完一轮后重新洗牌，并避免和上一条连续重复。
 */
export function useRandomPicker<T extends Identifiable>(pool: T[]): Picker<T> {
  const [state, setState] = useState<PickerState<T>>(() => createState(pool))

  const poolKey = pool.map((item) => item.id).join("|")
  if (state.key !== poolKey) {
    setState(createState(pool))
  }

  const draw = useCallback(() => {
    setState((prev) => {
      if (prev.pool.length === 0) return prev

      let { order } = prev
      let next = prev.cursor + 1

      if (next >= order.length) {
        // 一轮抽完，重新洗牌
        order = shuffled(prev.pool.length)
        // 尽量避免新的一轮第一条和上一轮最后一条撞车
        if (order.length > 1 && prev.cursor >= 0) {
          const lastId = prev.pool[prev.order[prev.cursor]]?.id
          if (lastId !== undefined && prev.pool[order[0]]?.id === lastId) {
            const tmp = order[0]
            order[0] = order[1]
            order[1] = tmp
          }
        }
        next = 0
        return { ...prev, order, cursor: next, seen: new Set([prev.pool[order[0]].id]) }
      }

      const item = prev.pool[order[next]]
      return { ...prev, order, cursor: next, seen: new Set(prev.seen).add(item.id) }
    })
  }, [])

  return {
    current: state.cursor >= 0 ? state.pool[state.order[state.cursor]] : null,
    seenCount: state.seen.size,
    total: state.pool.length,
    exhausted: state.pool.length > 0 && state.seen.size >= state.pool.length,
    draw,
  }
}
