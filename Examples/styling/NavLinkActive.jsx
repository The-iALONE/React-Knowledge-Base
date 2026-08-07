// Examples/styling/NavLinkActive.jsx — Styling/CSS-Modules.md + React-Router/Navigation.md
import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";

export default function PageNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.link}>
        Home
      </NavLink>
      <NavLink to="/pricing" className={styles.link}>
        Pricing
      </NavLink>
      <NavLink to="/login" className={styles.link}>
        Log in
      </NavLink>
    </nav>
  );
}
