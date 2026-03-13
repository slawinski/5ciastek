import Button from "@/components/Button";
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
  Droplets,
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
        <Button
          onClick={() => setIsOpen(true)}
          className={styles["icon-button"]}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </Button>
        <h1 className={styles.title}>
          <Link to="/" className={styles["centered-link-content"]}>
            <Croissant /> 5ciastek
          </Link>
        </h1>
        {SHOW_PROFILE_MENU && (
          <div
            className={styles["profile-menu-container"]}
            ref={profileMenuRef}
          >
            <Button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={styles["icon-button"]}
              aria-label="Toggle profile menu"
            >
              <User size={24} />
            </Button>
            {isProfileMenuOpen && (
              <div className={styles["profile-dropdown"]}>
                <Link
                  to="/profile"
                  className={styles["dropdown-item"]}
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  className={styles["dropdown-item"]}
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      <aside ref={asideRef} className={sidebarClassName}>
        <div className={styles["sidebar-header"]}>
          <h2 className={styles["sidebar-title"]}>
            <Link to="/" className={styles["desktop-title"]} onClick={() => setIsOpen(false)}>
              <Croissant /> 5ciastek
            </Link>
            <span className={styles["mobile-title"]}>Navigation</span>
          </h2>
          <Button
            onClick={() => setIsOpen(false)}
            className={styles["icon-button"]}
            aria-label="Close menu"
          >
            <X size={24} />
          </Button>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={styles.navLink}
          >
            <Home size={20} />
            <span>Fermentation Calculator</span>
          </Link>
          <Link
            to="/hydration"
            onClick={() => setIsOpen(false)}
            className={styles.navLink}
          >
            <Droplets size={20} />
            <span>Hydration Calculator</span>
          </Link>
          <Link
            to="/bake-a-long"
            onClick={() => setIsOpen(false)}
            className={styles.navLink}
          >
            <Route size={20} />
            <span>Bake-A-Long</span>
          </Link>
          <Link
            to="/bake-history"
            onClick={() => setIsOpen(false)}
            className={styles.navLink}
          >
            <ClipboardClock size={20} />
            <span>Bake History</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
