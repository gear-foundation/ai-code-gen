import React from 'react';
import containerStyles from '../styles/containers.module.scss';
import styles from './styles/container.module.scss';
import clsx from 'clsx';

interface Props {
    children?: React.ReactNode,
    style?: React.CSSProperties | undefined 
}

export const GrayContainer = ({ children, style }: Props) => {
  return (
    <div
        className={clsx(
            containerStyles.container,
            styles.grayContainer,
        )}
        style={style}
    >
        {children}
    </div>
  )
};
