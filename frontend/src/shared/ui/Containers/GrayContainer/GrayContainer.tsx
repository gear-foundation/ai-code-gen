import React from "react"
import clsx from "clsx"

import containerStyles from "../styles/containers.module.scss"
import styles from "./styles/container.module.scss"

interface Props {
  children?: React.ReactNode
  style?: React.CSSProperties | undefined
  className?: string
}

export const GrayContainer = ({ children, style, className }: Props) => {
  return (
    <div className={clsx("rounded-xl bg-gray-100", styles.grayContainer, className)} style={style}>
      {children}
    </div>
  )
}
