import React from "react";
import styles from "./InputField.module.css";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name: string;
  ref?: React.Ref<HTMLInputElement>;
}

export const InputField = ({
  label,
  id,
  name,
  className,
  ref,
  ...props
}: InputFieldProps) => {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles['input-wrapper']}>
        <input
          name={name}
          id={id}
          className={`${styles.input} ${className || ''}`.trim()}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
};
