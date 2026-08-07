// Examples/styling/ButtonModule.jsx — Styling/CSS-Modules.md
import styles from "./Button.module.css";

export default function Button({ children, onClick, type = "primary" }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styles[type]}`}
    >
      {children}
    </button>
  );
}
