import React from 'react';
import MainDashboard from '../../layouts/Dashboard/MainDashboard';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
  return (
    <MainDashboard>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Trang Tổng Quan</h1>
          <div className={styles.timeFilter}>
            <button className={styles.active}>Last 24 hours</button>
            <button>Last week</button>
            <button>Last month</button>
            <button>Last year</button>
          </div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metricCard}>
            <h3>Total Revenue</h3>
            <div className={styles.metricValue}>$612,839</div>
            <div className={styles.metricChange}>↑ 5%</div>
          </div>
          
          <div className={styles.metricCard}>
            <h3>Total Customer</h3>
            <div className={styles.metricValue}>513,456</div>
            <div className={styles.metricChange}>↑ 0.4%</div>
          </div>
          
          <div className={styles.metricCard}>
            <h3>Total Transaction</h3>
            <div className={styles.metricValue}>637,902</div>
            <div className={styles.metricChange}>↑ 8%</div>
          </div>
          
          <div className={styles.metricCard}>
            <h3>Total Product</h3>
            <div className={styles.metricValue}>256,600</div>
            <div className={styles.metricChange}>↑ 3%</div>
          </div>
        </div>

        <div className={styles.chartSection}>
          <div className={styles.chartContainer}>
            <h2>Revenue Growth</h2>
            <div className={styles.chartPlaceholder}>
              [Revenue Growth Chart Placeholder]
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <h2>Year detail</h2>
            <div className={styles.chartPlaceholder}>
              [Year Detail Chart Placeholder]
            </div>
          </div>
        </div>

        <div className={styles.tablesSection}>
          <div className={styles.tableContainer}>
            <h2>Top Transaction</h2>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>First item</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#25442</td>
                  <td>Leather one top & next...</td>
                  <td>17 Jan</td>
                </tr>
                <tr>
                  <td>#25526</td>
                  <td>Female Two flag</td>
                  <td>3 Jan</td>
                </tr>
                <tr>
                  <td>Customer ID FEMSID</td>
                  <td>Lummy Health...</td>
                  <td>4 Jan</td>
                </tr>
                <tr>
                  <td>#25700</td>
                  <td>Female Three flag</td>
                  <td>2 Jan</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className={styles.tableContainer}>
            <h2>Top Product</h2>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Product</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#25842</td>
                  <td>Deliver Jacket with VINY Features</td>
                  <td>3 Jan</td>
                </tr>
                <tr>
                  <td>Customer ID FEMSID</td>
                  <td>Female Two Flag</td>
                  <td>4 Jan</td>
                </tr>
                <tr>
                  <td>#25700</td>
                  <td>Lummy Health...</td>
                  <td>2 Jan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainDashboard>
  );
};

export default AdminDashboard;