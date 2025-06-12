import React from "react"
import { cn } from "@/shared/utils/cn"

interface IconProps extends React.SVGAttributes<SVGElement> {
  as?: React.ComponentType<any>
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number
  color?: string
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, as: Component, size = "md", color, ...props }, ref) => {
    if (!Component) {
      return null
    }

    const getSizeClass = (size: IconProps["size"]) => {
      if (typeof size === "number") {
        return undefined // Будем использовать inline стили
      }

      switch (size) {
        case "xs":
          return "w-3 h-3"
        case "sm":
          return "w-4 h-4"
        case "md":
          return "w-5 h-5"
        case "lg":
          return "w-6 h-6"
        case "xl":
          return "w-8 h-8"
        default:
          return "w-5 h-5"
      }
    }

    const sizeClass = getSizeClass(size)
    const inlineStyles =
      typeof size === "number"
        ? {
            width: `${size}px`,
            height: `${size}px`,
            ...props.style,
          }
        : props.style

    return (
      <Component
        ref={ref}
        className={cn("inline-block flex-shrink-0", sizeClass, className)}
        style={{
          color,
          ...inlineStyles,
        }}
        {...props}
      />
    )
  }
)

Icon.displayName = "Icon"
