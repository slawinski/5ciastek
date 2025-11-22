import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Home, Menu, X } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null); // Create a ref for the aside element

  const sidebarClassName = `${styles.sidebar} ${
    isOpen ? styles.sidebarOpen : ""
  }`;

  // Effect to handle clicks outside the aside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        asideRef.current &&
        !asideRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Re-run effect if isOpen changes

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

      <aside ref={asideRef} className={sidebarClassName}>
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
