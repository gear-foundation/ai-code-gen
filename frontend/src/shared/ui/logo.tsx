import { VaraLogoIcon } from "@/shared/assets/images"
import clsx from "clsx"
import { Link } from "react-router-dom"

interface LogoProps {
  size?: "small" | "medium" | "large"
  color?: "white" | "black"
}

const sizeClasses = {
  small: "h-8.5",
  medium: "h-14.5",
  large: "h-25",
}

const colorClasses = {
  white: "text-background",
  black: "text-foreground",
}

export const Logo = ({ size = "medium", color = "black" }: LogoProps) => {
  return (
    <Link to="/" className="w-fit">
      <VaraLogoIcon className={clsx("size-auto", sizeClasses[size], colorClasses[color])} />
    </Link>
  )
}
