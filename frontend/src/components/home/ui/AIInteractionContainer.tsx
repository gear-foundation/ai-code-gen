import React from "react"
import { GrayContainer } from "@/shared/ui/Containers/GrayContainer/GrayContainer"

import styles from "../styles/ai_interaction_container.module.scss"

interface Props {
  interactionTitle: string
  leftSideChildren?: React.ReactNode
  children?: React.ReactNode
}

export const AIInteractionContainer = ({ interactionTitle, leftSideChildren, children }: Props) => {
  return (
    <div className="size-full">
      <GrayContainer className="min-h-[20rem] w-full p-5 pt-0">
        <div className={styles.textAreaData}>
          <h3 className={styles.interactionTitle}>{interactionTitle}</h3>
          <div className={styles.buttonsContainer}>{leftSideChildren}</div>
        </div>
        {children}
      </GrayContainer>
    </div>
  )
}
