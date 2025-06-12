import React from "react"
import clsx from "clsx"

import cardsStyles from "../styles/cards.module.scss"
import styles from "../styles/large_card.module.scss"

interface Props {
  title: string
  description: string
  icon: React.ReactNode
}

export const LargeCard = ({ icon, title, description }: Props) => {
  return (
    <div className={clsx(cardsStyles.card, styles.largeInfoCard)}>
      <div className={styles.largeInfoCardTitleContainer}>
        {icon}
        <h3 className={styles.largeInfoCardTitle}>{title}</h3>
      </div>
      <p className={clsx(cardsStyles.cardData, styles.largeInfoData)}>{description}</p>
    </div>
  )
}
