import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/Button";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the modal content
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']}>
      <div
        className={styles['modal-content']}
        ref={modalContentRef}
      >
        <div className={styles['modal-window-bar']}>
          <div className={styles['window-controls']}>
            <Button className={styles["close-button"]} onClick={onClose} aria-label="Zamknij pomoc">
              <X />
            </Button>
          </div>
        </div>
        <div className={styles['modal-content-body']}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
