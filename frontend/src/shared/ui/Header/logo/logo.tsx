import { Link } from 'react-router-dom';
import { VaraLogoIcon } from '@/shared/assets/images';
import styles from './logo.module.scss';
import clsx from 'clsx';

interface Props {
  color?: 'white' | 'black';
  size?: 'large' | 'medium' | 'small';
}

function Logo({ color='white', size='medium' }: Props) {
  return (
    <Link to="/">
      <div className={styles['size-' + size]}>
        <VaraLogoIcon 
          className={
            clsx(
              styles.logo,
              styles['color--' + color], 
            )
          } 
        />
      </div>
    </Link>
  );
}

export { Logo };
