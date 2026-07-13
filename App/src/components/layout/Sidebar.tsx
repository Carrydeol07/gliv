import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>GLIV</div>
      
      <nav className={styles.nav}>
        <NavLink 
          to="/library" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Library
        </NavLink>
        <NavLink 
          to="/collections" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Collections
        </NavLink>
        <NavLink 
          to="/discover" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Discover
        </NavLink>
        <NavLink 
          to="/updates" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Updates
        </NavLink>
      </nav>

      <div className={styles.spacer} />

      <nav className={styles.nav}>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
