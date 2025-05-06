import React, { useState } from 'react';
import styles from './Login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [notifications, setNotifications] = useState([]); // State để quản lý thông báo
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Hàm thêm thông báo
  const addNotification = (message, type = 'success') => {
    // Chỉ giữ một thông báo tại một thời điểm: xóa tất cả thông báo hiện tại
    setNotifications([]);
    const id = Date.now(); // Tạo ID duy nhất cho thông báo
    setNotifications([{ id, message, type, isExiting: false }]);

    // Tự động xóa thông báo sau 6 giây
    setTimeout(() => {
      handleRemoveNotification(id);
    }, 6000);
  };

  // Hàm xử lý xóa thông báo với hiệu ứng
  const handleRemoveNotification = (id) => {
    // Đánh dấu thông báo đang rời đi để áp dụng hiệu ứng slideOut
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isExiting: true } : notif
      )
    );

    // Chờ hiệu ứng hoàn tất (0.3s) trước khi xóa hoàn toàn
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 300); // Thời gian khớp với animation slideOut
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authService.login(formData.username, formData.password);
      
      // Lưu thông tin rememberMe
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
  
      // Sử dụng role từ response thay vì localStorage để đảm bảo đồng bộ
      const role = response.result?.role || localStorage.getItem('userRole');
      
      if (role === 'ADMIN') {
        addNotification('Đăng nhập thành công, đang chuyển hướng!', 'success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000); // Chờ 1 giây để người dùng thấy thông báo
      } else {
        addNotification('Đăng nhập thành công, đang chuyển hướng!', 'success');
        setTimeout(() => {
          navigate('/home_page');
        }, 2000); // Chờ 1 giây để người dùng thấy thông báo
      }
  
    } catch (err) {
      addNotification("Tên đăng nhập hoặc mật khẩu chưa chính xác, vui lòng nhập lại!", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Xử lý đăng nhập mạng xã hội ở đây
  };

  return (
    <main className={styles['login-bg']}>
      <div className={styles['login-form-area']}>
        <form className={styles['login-form']} onSubmit={handleSubmit}>
          {/* Thanh thông báo */}
          <div className={styles.notificationContainer}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.notification} ${
                  notif.type === 'success' ? styles.success : styles.error
                } ${notif.isExiting ? styles.exiting : ''}`}
              >
                <span>{notif.message}</span>
                <button
                  className={styles.closeButton}
                  onClick={() => handleRemoveNotification(notif.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>

          {/* Login Heading */}
          <div className={styles['login-heading']}>
            <span>Đăng Nhập</span>
            <p>Nhập thông tin đăng nhập để có quyền truy cập</p>
          </div>

          {/* Input Fields */}
          <div className={styles['input-box']}>
            <div className={styles['single-input-fields']}>
              <label htmlFor="username">
                <FontAwesomeIcon icon={faUser} className={styles['input-icon']} />
                Username hoặc Địa chỉ Email 
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username / Địa chỉ Email"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles['single-input-fields']}>
              <label htmlFor="password">
                <FontAwesomeIcon icon={faLock} className={styles['input-icon']} />
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={`${styles['single-input-fields']} ${styles['login-check']}`}>
              <div className={styles['checkbox-container']}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className={styles['custom-checkbox']}
                  disabled={loading}
                />
                <label htmlFor="rememberMe" className={styles['checkbox-label']}>
                  <FontAwesomeIcon icon={faCheck} className={styles['check-icon']} />
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <a href="#" className={styles['f-right']}>Quên mật khẩu?</a>
            </div>
          </div>

          {/* Form Footer */}
          <div className={styles['login-footer']}>
            <p>Chưa có tài khoản? <a href="/register">Đăng ký</a> tại đây!</p>
            <button 
              type="submit" 
              className={styles['submit-btn3']}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {/* Social Login */}
          <div className={styles['social-login']}>
            <p>Hoặc tiếp tục với</p>
            <div className={styles['social-buttons']}>
              <button 
                type="button" 
                className={`${styles['social-btn']} ${styles['google']}`}
                onClick={() => handleSocialLogin('Google')}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faGoogle} className={styles['social-icon']} /> 
                <span>Google</span>
              </button>
              <button 
                type="button" 
                className={`${styles['social-btn']} ${styles['facebook']}`}
                onClick={() => handleSocialLogin('Facebook')}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFacebookF} className={styles['social-icon']} /> 
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;