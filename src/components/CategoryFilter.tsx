import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: { name: string; count: number }[]
  active: string | null
  total: number
  onChange: (category: string | null) => void
}

export function CategoryFilter({ categories, active, total, onChange }: CategoryFilterProps) {
  if (categories.length === 0) return null

  return (
    <nav
      aria-label="知识分类"
      className="flex flex-wrap gap-2 pb-1"
    >
      <Chip active={active === null} onClick={() => onChange(null)}>
        全部
        <Count value={total} />
      </Chip>

      {categories.map((category) => (
        <Chip
          key={category.name}
          active={active === category.name}
          onClick={() => onChange(category.name)}
        >
          {category.name}
          <Count value={category.count} />
        </Chip>
      ))}
    </nav>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </button>
  )
}

function Count({ value }: { value: number }) {
  return <span className="text-xs opacity-60 tabular-nums">{value}</span>
}
