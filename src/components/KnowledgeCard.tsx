import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KnowledgeItem } from "@/types/knowledge"

interface KnowledgeCardProps {
  item: KnowledgeItem
  index: number
}

export function KnowledgeCard({ item, index }: KnowledgeCardProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${item.title}\n\n${item.body}`)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card
      key={item.id}
      className="animate-card-in flex min-h-[17rem] flex-col py-6 sm:min-h-[19rem]"
    >
      <CardHeader className="gap-3">
        <Badge variant="secondary" className="w-fit px-2.5 py-1">
          {item.category}
        </Badge>

        <CardTitle className="text-balance text-xl font-semibold leading-snug sm:text-2xl">
          {item.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-5">
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          {item.body}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-muted-foreground/60 tabular-nums">
            NO.{String(index).padStart(3, "0")}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-muted-foreground"
            aria-label="复制这条知识"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "已复制" : "复制"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
