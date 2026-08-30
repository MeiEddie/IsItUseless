import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
      title={isDark ? "切换到浅色模式" : "切换到深色模式"}
    >
      <Sun className={`size-4 transition-opacity ${isDark ? "opacity-0 absolute" : "opacity-100"}`} />
      <Moon className={`size-4 transition-opacity ${isDark ? "opacity-100 absolute" : "opacity-0"}`} />
    </Button>
  )
}
