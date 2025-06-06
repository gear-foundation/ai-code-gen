import { GrayContainer } from "@/shared/ui/Containers/GrayContainer/GrayContainer";
import styles from '../styles/ai_interaction_container.module.scss';
import React from "react";

interface Props {
    interactionTitle: string;
    leftSideChildren?: React.ReactNode,
    children?: React.ReactNode
}

export const AIInteractionContainer = ({ interactionTitle, leftSideChildren, children }: Props) => {
  return (
    <div
      className={styles.aiInteractionContainer}
    >
      <GrayContainer
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '71%',
          padding: '0 20px 20px 20px',
          minHeight: '20rem',
        }}
      >
        <div
          className={styles.textAreaData}
        >
          <h3
            className={styles.interactionTitle}
          >
            { interactionTitle }
          </h3>
          <div
            className={styles.buttonsContainer}
          >
            { leftSideChildren }
          </div>
        </div>
        { children }
      </GrayContainer>
    </div>
  )
};
