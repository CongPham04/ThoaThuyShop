import React from 'react';
import Header from '../../components/Dashboard/Headers/Header';
import Sidebar from '../../components/Dashboard/Sidebars/Sidebar';
import styles from './MainDashboard.module.css';

const MainDashboard = ({ children }) => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;