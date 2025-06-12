import React from "react"
import { cn } from "@/shared/utils/cn"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "focus-visible:ring-ring inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
            "text-muted-foreground bg-muted hover:bg-muted/80": variant === "secondary",
            "border-input hover:bg-accent hover:text-accent-foreground border": variant === "outline",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          },
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
