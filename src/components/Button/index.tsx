import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  const buttonClassName = `${styles.button} ${className || ''}`.trim();
  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
