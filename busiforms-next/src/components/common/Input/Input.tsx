import { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({ error, ...props }: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
} 