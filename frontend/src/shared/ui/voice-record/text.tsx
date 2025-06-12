import React from "react"
import { cn } from "@/shared/utils/cn"

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  weight?: "normal" | "medium" | "semibold" | "bold"
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, as = "p", size = "md", weight = "normal", ...props }, ref) => {
    const Component = as as any

    return (
      <Component
        ref={ref}
        className={cn(
          {
            "text-xs": size === "xs",
            "text-sm": size === "sm",
            "text-base": size === "md",
            "text-lg": size === "lg",
            "text-xl": size === "xl",
          },
          {
            "font-normal": weight === "normal",
            "font-medium": weight === "medium",
            "font-semibold": weight === "semibold",
            "font-bold": weight === "bold",
          },
          className
        )}
        {...props}
      />
    )
  }
)

Text.displayName = "Text"
