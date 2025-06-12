import React from "react"
import { cn } from "@/shared/utils/cn"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  withDotsBackground?: boolean
  withLinesBackground?: boolean
  icon?: React.ReactNode
  title?: string
  description?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      withDotsBackground = false,
      withLinesBackground = false,
      icon,
      title,
      description,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl bg-white p-6 shadow-[0px_64px_194px_0px] shadow-foreground/10",

          className
        )}
        {...props}
      >
        {children ? (
          children
        ) : (
          <div className="flex h-full flex-col gap-2">
            {(icon || title) && (
              <div className="flex items-start gap-4">
                {icon && <div className="shrink-0 grow-0 text-brand-600 [&>svg]:size-6">{icon}</div>}
                {title && <h3 className="text-xl leading-tight font-semibold text-gray-900">{title}</h3>}
              </div>
            )}
            {description && <p className="text-[#535352]">{description}</p>}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = "Card"
