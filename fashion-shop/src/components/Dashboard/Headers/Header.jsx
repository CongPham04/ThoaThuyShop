import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import adminAvatar from '../../../assets/img/profiles/53b90b59-67fe-42e4-bf10-d9e1f10ebc80.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Xóa token
    localStorage.removeItem('userInfo'); // Xóa thông tin người dùng
    navigate('/login'); // Điều hướng về trang đăng nhập
  };

  // Điều hướng đến trang thông tin tài khoản
  const handleAccountInfo = () => {
    navigate('/account');
    setIsMenuOpen(false); // Đóng menu sau khi click
  };

  return (
    <header className={styles.header}>
      {/* Tiêu đề Dashboard */}
      <h1 className={styles.title}>Dashboard</h1>

      {/* Thanh công cụ bên phải */}
      <div className={styles.toolbar}>
        {/* Thanh search */}
        {/* <div className={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput}
          />
        </div> */}

        {/* Icon thông báo */}
        <button className={styles.notificationButton}>
          <FontAwesomeIcon icon={faBell} />
          <span className={styles.notificationBadge}>3</span>
        </button>

        {/* Avatar admin với dropdown */}
        <div 
          className={styles.adminProfile}
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <img 
            src={adminAvatar}
            alt="Admin" 
            className={styles.avatar}
          />
          <span className={styles.adminName}>Admin</span>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={handleAccountInfo} className={styles.menuItem}>
                <FontAwesomeIcon icon={faUser} className={styles.menuIcon} />
                Thông tin tài khoản
              </button>
              <button onClick={handleLogout} className={styles.menuItem}>
                <FontAwesomeIcon icon={faSignOutAlt} className={styles.menuIcon} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;