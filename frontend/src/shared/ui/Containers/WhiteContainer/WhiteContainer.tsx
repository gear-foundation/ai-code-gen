import React from "react"
import clsx from "clsx"

import containerStyles from "../styles/containers.module.scss"
import styles from "./styles/container.module.scss"

interface Props {
  children?: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}

export const WhiteContainer = ({ children, style, onClick }: Props) => {
  return (
    <div
      className={clsx("rounded-xl", containerStyles.container, styles.whiteContainer)}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
