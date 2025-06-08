import { useState } from "react"
import { cn } from "@/shared/utils/cn"

import type { AIPromptOptions } from "../models/ai_options"

interface Props {
  options: string[]
  currentSelected: AIPromptOptions
  waitingForResponse?: boolean
  selected?: (name: string, id: AIPromptOptions) => void
}

export const AIOptionSelection = ({
  options,
  currentSelected,
  waitingForResponse = false,
  selected = (name: string, id: AIPromptOptions) => {},
}: Props) => {
  const [optionSelected, setOptionSelected] = useState<AIPromptOptions>(currentSelected)

  return (
    <div className="mx-auto flex w-fit gap-px rounded-xl bg-zinc-100 p-1 shadow-[inset_0px_0.4px_1.2px_0] shadow-foreground/20">
      {options.map((value, index) => {
        const isSelected = optionSelected === (options[index] as AIPromptOptions)

        return (
          <button
            key={index}
            onClick={() => {
              if (waitingForResponse) return
              setOptionSelected(options[index] as AIPromptOptions)
              selected(value, options[index] as AIPromptOptions)
            }}
            className={cn(
              "cursor-pointer rounded-xl px-5 py-1.25 font-semibold",
              isSelected
                ? "rounded-[10px] bg-background shadow-[0_0.4px_1.2px_0] shadow-foreground/20"
                : "text-muted transition-colors hover:text-foreground",
              waitingForResponse && "cursor-not-allowed"
            )}
          >
            {value}
          </button>
        )
      })}
    </div>
  )
}
