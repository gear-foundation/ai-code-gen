import { Button } from "@gear-js/vara-ui";
import { GithubMark } from "@/shared/assets/images";
import { useNavigate } from "react-router-dom";
import styles from '../styles/header_info.module.scss';

export const HeaderInfo = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
        <div className={styles.subcontainer}>
            <h1 className={styles.subtitle}>
                Ecosystem Tooling for Vara Network
            </h1>
        </div>
        <div className={styles.subcontainer}>
            <p className={styles.description}>
                Discover cutting-edge development solutions, accelerate your DApp creations, 
                and harness AI-driven automation for secure, efficient, and scalable Smart 
                Contract experiences.
            </p>
            <div className={ styles.buttonsContainer }>
                <a href="#subtitle-ready-to-build">
                    <Button
                        text="Get started"
                        color="primary"
                        size="x-large"
                        className={styles.button}
                        
                    />
                </a>
                <a href="https://github.com/gear-foundation">
                    <Button
                        color="grey"
                        size="x-large"
                        className={styles.button}
                    >
                        <div className={styles.logoContainer}>
                            <GithubMark className={styles.gihubLogo} />
                        </div>
                        Github
                    </Button>
                </a>
            </div>
        </div>
    </div>
  )
}
