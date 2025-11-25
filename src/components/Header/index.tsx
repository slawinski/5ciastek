import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  Menu,
  X,
  Route,
  ClipboardClock,
  User,
  Croissant,
} from "lucide-react";
import styles from "./Header.module.css";

const SHOW_PROFILE_MENU = false; // Feature flag to hide the profile icon and menu

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null); // Create a ref for the aside element
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const sidebarClassName = `${styles.sidebar} ${
    isOpen ? styles["sidebar-open"] : ""
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

  // Effect to handle clicks outside the profile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        isProfileMenuOpen
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]); // Re-run effect if isProfileMenuOpen changes

  return (
    <>
      <header className={styles.header}>
        <button
          onClick={() => setIsOpen(true)}
          className={styles["icon-button"]}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className={styles.title}>
          <Link to="/" className={styles['centered-link-content']}>
            <Croissant /> 5ciastek
          </Link>
        </h1>
        {SHOW_PROFILE_MENU && (
          <div className={styles["profile-menu-container"]} ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={styles["icon-button"]}
              aria-label="Toggle profile menu"
            >
              <User size={24} />
            </button>
            {isProfileMenuOpen && (
              <div className={styles["profile-dropdown"]}>
                <Link
                  to="/profile"
                  className={styles["dropdown-item"]}
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className={styles["dropdown-item"]}
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <aside ref={asideRef} className={sidebarClassName}>
        <div className={styles["sidebar-header"]}>
          <h2 className={styles["sidebar-title"]}>Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={`${styles["icon-button"]} ${styles["icon-button-white"]}`}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={styles["nav-link"]}
            // activeProps is no longer needed; styling is handled
            // by the [aria-current="page"] selector in the CSS module.
          >
            <Home size={20} />
            <span>Fermentation Calculator</span>
          </Link>
          <Link
            to="/bake-history"
            onClick={() => setIsOpen(false)}
            className={styles["nav-link"]}
          >
            <ClipboardClock size={20} />
            <span>Bake History</span>
          </Link>
          <Link
            to="/bake-a-long"
            onClick={() => setIsOpen(false)}
            className={styles["nav-link"]}
          >
            <Route size={20} />
            <span>Bake-A-Long</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
