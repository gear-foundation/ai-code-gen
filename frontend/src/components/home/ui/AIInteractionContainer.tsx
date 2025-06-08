import React from "react"

interface Props {
  interactionTitle: string
  leftSideChildren?: React.ReactNode
  children?: React.ReactNode
}

export function AIInteractionContainer({ interactionTitle, leftSideChildren, children }: Props) {
  return (
    <div className="flex w-full flex-col gap-8 rounded-xl bg-background p-6 shadow-[0px_64px_194px_0px,_inset_0px_0.4px_1.2px_0_var(--color-foreground)] shadow-foreground/10">
      <div className="flex items-center justify-between gap-6">
        <h3 className="font-medium text-muted">{interactionTitle}</h3>
        <div className="flex gap-4">{leftSideChildren}</div>
      </div>
      {children}
    </div>
  )
}
