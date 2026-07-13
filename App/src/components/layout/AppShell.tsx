import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import styles from './AppShell.module.css';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.appShell}>
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
