import { Button } from "@gear-js/vara-ui";
import styles from './styles/button.module.scss';

interface Props {
    text: string
}

export const VaraWhiteButton = ({ text }: Props) => {
    
    return (
        <Button 
            text={text} 
            color="border" 
            size="x-large"
            className={styles.button} 
        />  
    )
}
