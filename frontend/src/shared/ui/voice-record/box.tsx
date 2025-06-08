import React from "react"
import { cn } from "@/shared/utils/cn"

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements
  children?: React.ReactNode
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ className, as = "div", children, ...props }, ref) => {
  const Component = as as any

  return (
    <Component ref={ref} className={cn(className)} {...props}>
      {children}
    </Component>
  )
})

Box.displayName = "Box"
