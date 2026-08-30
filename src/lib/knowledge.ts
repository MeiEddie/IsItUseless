import knowledgeRaw from "../../Knowledge.md?raw"

import { collectCategories, parseKnowledge } from "./parseKnowledge"
import type { KnowledgeItem } from "@/types/knowledge"

export const allItems: KnowledgeItem[] = parseKnowledge(knowledgeRaw)

export const categories = collectCategories(allItems)
