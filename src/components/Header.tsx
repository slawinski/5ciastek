import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Menu, X } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarClassName = `${styles.sidebar} ${
    isOpen ? styles.sidebarOpen : ""
  }`;

  return (
    <>
      <header className={styles.header}>
        <button
          onClick={() => setIsOpen(true)}
          className={styles.iconButton}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className={styles.title}>
          <Link to="/">🥐 5ciastek</Link>
        </h1>
      </header>

      <aside className={sidebarClassName}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={styles.iconButton}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={styles.navLink}
            // activeProps is no longer needed; styling is handled
            // by the [aria-current="page"] selector in the CSS module.
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
