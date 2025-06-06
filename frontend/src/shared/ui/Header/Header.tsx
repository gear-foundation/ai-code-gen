import { Logo } from "./logo"
import clsx from "clsx"
import styles from "./styles/header.module.scss"
import React from "react"

interface Props {
  backgroundColor?: "transparent" | "black"
  children?: React.ReactNode
}

export const Header = ({ backgroundColor = "transparent", children }: Props) => {
  return (
    <>
      <header className={clsx(styles.header)}>
        <div className={styles["header-main"]}>
          <Logo />
        </div>
        <div>{children}</div>
        <div className={styles.headerComponentStyle} />
      </header>
    </>
  )
}
