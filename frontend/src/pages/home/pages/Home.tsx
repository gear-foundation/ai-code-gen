import { Cards } from "../ui/Cards"
import { AISection } from "../ui/AISection"
import styles from "../styles/home.module.scss"

function Home() {
  return (
    <>
      <Cards />
      <div className={styles.questionInfoContainer}>
        <h2 className={styles.titleQuestion} id="subtitle-ready-to-build">
          Ready to build secure and scalable dApps?
        </h2>
        <p className={styles.questionInfo}>
          Take advantage of AI Agents to streamline your workflows, cut down development time, and ensure robust
          security for all your smart contracts.
        </p>
      </div>
      <AISection />
    </>
  )
}

export { Home }
