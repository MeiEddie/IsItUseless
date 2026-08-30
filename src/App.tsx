import { useEffect, useMemo, useState } from "react"
import { SearchX, Shuffle } from "lucide-react"

import { CategoryFilter } from "@/components/CategoryFilter"
import { KnowledgeCard } from "@/components/KnowledgeCard"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRandomPicker } from "@/hooks/useRandomPicker"
import { allItems, categories } from "@/lib/knowledge"

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const pool = useMemo(
    () => (activeCategory ? allItems.filter((item) => item.category === activeCategory) : allItems),
    [activeCategory]
  )

  const { current, draw, seenCount, total, exhausted } = useRandomPicker(pool)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return

      if (event.code === "Space" || event.key === "r" || event.key === "R") {
        event.preventDefault()
        draw()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [draw])

  const ordinal = current ? allItems.findIndex((item) => item.id === current.id) + 1 : 0
  const progress = total > 0 ? (seenCount / total) * 100 : 0

  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <main className="relative mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-10 sm:gap-10 sm:px-8 sm:py-14">
        <header className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <h1 className="font-mono text-[1.75rem] font-black leading-none tracking-tight sm:text-5xl">
                IS IT USELESS
                <span className="ml-2 text-primary/30">?</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                没用，但你忍不住想知道。共 {allItems.length} 条。
              </p>
            </div>
            <ThemeToggle />
          </div>

          <CategoryFilter
            categories={categories}
            active={activeCategory}
            total={allItems.length}
            onChange={setActiveCategory}
          />
        </header>

        <section aria-live="polite" aria-atomic="true">
          {current ? (
            <KnowledgeCard item={current} index={ordinal} />
          ) : (
            <Card className="flex min-h-[17rem] flex-col items-center justify-center gap-2 text-center">
              <SearchX className="size-7 text-muted-foreground/40" />
              <p className="font-medium">这个分类下还没有知识</p>
              <p className="text-xs text-muted-foreground">往 Knowledge.md 里加几条就好了</p>
            </Card>
          )}
        </section>

        <footer className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={draw}
            disabled={total === 0}
            className="h-12 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/10 transition-transform active:scale-[0.97]"
          >
            <Shuffle className="size-4" />
            换一条
          </Button>

          {total > 0 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <Progress value={progress} className="h-1 w-32 sm:w-44" />
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {seenCount} / {total}
                </span>
              </div>
              <p className="text-xs text-muted-foreground/80">
                {exhausted ? "本轮全部抽完，再抽会重新洗牌" : "本轮不重复"}
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground/70">
            快捷键{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
              空格
            </kbd>{" "}
            或{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
              R
            </kbd>
          </p>
        </footer>

        <p className="text-center text-xs text-muted-foreground/60">
          编辑项目根目录的 Knowledge.md 即可添加知识，无需改动代码
        </p>
      </main>
    </div>
  )
}
