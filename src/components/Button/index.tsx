import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

const Button = ({ children, className, ref, ...props }: ButtonProps) => {
  const buttonClassName = `${styles.button} ${className || ''}`.trim();
  return (
    <button className={buttonClassName} ref={ref} {...props}>
      {children}
    </button>
  );
};

export default Button;
