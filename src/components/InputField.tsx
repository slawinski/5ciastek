import React from "react";
import styles from "./InputField.module.css";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  type?: string;
  [key: string]: any;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  id = "input",
  name = "input",
  type = "text",
  ...props
}) => {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div>
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
