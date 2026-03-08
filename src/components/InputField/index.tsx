import React from "react";
import styles from "./InputField.module.css";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string; // Made required for accessibility
  name: string; // Made required
  type?: string;
  [key: string]: any;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  id,
  name,
  type = "text",
  ...props
}) => {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles['input-wrapper']}>
        <input
          type={type}
          name={name}
          id={id}
          className={styles.input}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    </div>
  );
};
