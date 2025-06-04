import { Heading } from '@chakra-ui/react';
import { ROUTES } from '@/app/consts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@gear-js/vara-ui';
import ImageBase from '../assets/404.jpg';
import styles from '../styles/not-found.module.scss';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
      <img width="40%" src={ImageBase} alt="" />
        <div className={styles.header}>
          <Heading size="lg">Page not found</Heading>
        </div>
        <Button
          onClick={() => { navigate(ROUTES.HOME) }}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
}
