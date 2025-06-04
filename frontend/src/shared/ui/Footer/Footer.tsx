import { XIcon, GitHubIcon, MediumIcon, DiscordIcon, TelegramIcon } from './assets';
import styles from './styles/footer.module.scss';

export const Footer = () => {
  return (
    <footer
        className={styles.footer}
    >
        <div
            className={styles.dataContainer}
        >
            <div
                className={styles.linksContainer}
            >
                <a 
                    href="https://vara.network/education-hub" 
                    target='_blank'
                    className={styles.link}
                >
                    Education Hub
                </a>
                <a 
                    href="https://wiki.vara.network/" 
                    target='_blank'
                    className={styles.link}
                >
                    Vara Wiki
                </a>
                <a 
                    href="https://idea.gear-tech.io/programs?node=wss%3A%2F%2Ftestnet.vara.network" 
                    target='_blank'
                    className={styles.link}
                >
                    Gear IDEA
                </a>
                <a 
                    href="https://vara.subscan.io/" 
                    target='_blank'
                    className={styles.link}
                >
                    Vara Explorer (Subscan)
                </a>
            </div>
            <div
                className={styles.iconsLinksContainer}
            >
                <a href="https://x.com/VaraNetwork">
                    <XIcon />
                </a>
                <a href="https://github.com/gear-foundation">
                    <GitHubIcon />
                </a>
                <a href="https://medium.com/@VaraNetwork">
                    <MediumIcon />
                </a>
                <a href="https://discord.com/invite/x8ZeSy6S6K">
                    <DiscordIcon /> 
                </a>
                <a href="https://t.me/VaraNetwork_Global">
                    <TelegramIcon />
                </a>
            </div>
        </div>
        <div
            className={styles.gearInfo}
        >
            <p>     
                &#xA9; 2025 Gear Foundation, Inc. All Rights Reserved.
            </p>
        </div>
    </footer>
  )
}
