import React from "react";
import styles from "./LearnMoreModal.module.css";

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-window-bar']}>
          <div className={styles['window-title']}>Interpreting Fermentation Results</div>
          <div className={styles['window-controls']}>
            <button className={styles['close-button']} onClick={onClose}>
              X
            </button>
          </div>
        </div>
        <div className={styles['modal-content-body']}>
          <h2>Interpreting Fermentation Results</h2>
          <p>
            This section provides guidance on how to understand and utilize the
            calculated bulk fermentation, proofing, and total fermentation times.
          </p>
          <h3>Bulk Fermentation Time</h3>
          <p>
            Bulk fermentation (or first rise) is the period after mixing where the
            dough develops flavor and strength. The calculated time is an
            estimate, and factors like flour type, starter activity, and specific
            recipe will influence the optimal duration. Look for signs like:
          </p>
          <ul>
            <li>
              Increased volume (e.g., 20-50% rise depending on desired outcome).
            </li>
            <li>Dome-shaped top with rounded edges.</li>
            <li>Some gas bubbles visible on the surface.</li>
            <li>The dough should feel light and airy.</li>
          </ul>
          <p>
            **Adjustments:** If your kitchen is warmer than the input temperature,
            the actual bulk fermentation might be faster. If colder, it might be
            slower. Always prioritize the dough's feel and appearance over strict
            timing.
          </p>

          <h3>Proofing Time</h3>
          <p>
            Proofing (or final rise) is the last fermentation stage before baking.
            This is crucial for the final crumb structure and oven spring.
          </p>
          <ul>
            <li>The dough should appear noticeably larger and softer.</li>
            <li>
              A "poke test" can be helpful: gently poke the dough with a floured
              finger. If it springs back slowly and leaves a slight indentation,
              it's likely ready. If it springs back quickly, it needs more time.
              If it doesn't spring back at all and feels deflated, it's
              overproofed.
            </li>
            <li>
              The calculated time provides a starting point, but visual and
              tactile cues are paramount.
            </li>
          </ul>
          <p>
            **Retarding (Cold Proofing):** Many recipes involve retarding the
            dough in the refrigerator. This significantly slows down fermentation,
            developing more complex flavors. The calculator's proofing time is for
            room-temperature proofing.
          </p>

          <h3>Total Fermentation Time</h3>
          <p>
            This is the sum of bulk fermentation and proofing times. It represents
            the estimated active fermentation duration at the given temperature
            and hydration. Remember that these are guidelines, and experienced
            bakers often rely on sensory evaluation (touch, smell, sight) to
            determine readiness.
          </p>
          <p>Enjoy your baking!</p>
        </div>
      </div>
    </div>
  );
};

export default LearnMoreModal;