import React from "react"
import { cn } from "@/shared/utils/cn"

interface HStackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
}

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ className, spacing = 4, align = "center", justify = "start", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          `gap-${spacing}`,
          {
            "items-start": align === "start",
            "items-center": align === "center",
            "items-end": align === "end",
            "items-stretch": align === "stretch",
          },
          {
            "justify-start": justify === "start",
            "justify-center": justify === "center",
            "justify-end": justify === "end",
            "justify-between": justify === "between",
            "justify-around": justify === "around",
            "justify-evenly": justify === "evenly",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

HStack.displayName = "HStack"
