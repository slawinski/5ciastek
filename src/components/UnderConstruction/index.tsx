import React, { useState } from 'react';
import styles from './UnderConstruction.module.css';
import { InputField } from '@/components/InputField';
import Button from '@/components/Button'; // Import the new Button component

const UnderConstruction = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Email submitted: ${email}`);
    alert(`Thank you for your interest! We will notify you at ${email} when this feature is ready.`);
    setEmail('');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Under Construction</h2>
      <p className={styles.message}>
        This feature is currently under development. Please check back later.
      </p>
      <p className={styles.message}>
        Leave your email below to be notified when it's ready!
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email-newsletter"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <Button type="submit">
          Notify Me
        </Button>
      </form>
    </div>
  );
};

export default UnderConstruction;
