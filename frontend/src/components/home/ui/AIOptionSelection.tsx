import { useState } from "react"
import { cn } from "@/shared/utils/cn"
import { Select } from "@gear-js/vara-ui"

import type { AIPromptOptions } from "../models/ai_options"

interface Props {
  options: string[]
  currentSelected: AIPromptOptions
  waitingForResponse?: boolean
  selected?: (name: string, id: AIPromptOptions) => void
  className?: string
}

export function AIOptionSelection(props: Props) {
  return (
    <>
      <SegmentedOptions {...props} className="max-md:hidden" />
      <SelectOptions {...props} className="md:hidden" />
    </>
  )
}

function SegmentedOptions({
  options,
  currentSelected,
  waitingForResponse = false,
  selected = (name: string, id: AIPromptOptions) => {},
  className,
}: Props) {
  const [optionSelected, setOptionSelected] = useState<AIPromptOptions>(currentSelected)

  return (
    <div
      className={cn(
        "mx-auto flex w-fit gap-px rounded-xl bg-zinc-100 p-1 shadow-[inset_0px_0.4px_1.2px_0] shadow-foreground/20",
        className
      )}
    >
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

function SelectOptions({
  options,
  currentSelected,
  waitingForResponse = false,
  selected = (name: string, id: AIPromptOptions) => {},
  className,
}: Props) {
  const [optionSelected, setOptionSelected] = useState<AIPromptOptions>(currentSelected)

  return (
    <div>
      <Select
        name={"Variants"}
        size={"large"}
        className={cn("*:bg-background *:!py-2.5", className)}
        disabled={waitingForResponse}
        value={optionSelected}
        onChange={(e) => {
          const value = e.target.value
          if (waitingForResponse) return
          setOptionSelected(value as AIPromptOptions)
          selected(value, value as AIPromptOptions)
        }}
        options={options.map((value) => ({
          label: value,
          value,
        }))}
      />
    </div>
  )
}
