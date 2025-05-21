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
    rememberMe: false,
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addNotification = (message, type = 'success') => {
    setNotifications([]);
    const id = Date.now();
    setNotifications([{ id, message, type, isExiting: false }]);

    setTimeout(() => {
      handleRemoveNotification(id);
    }, 6000);
  };

  const handleRemoveNotification = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isExiting: true } : notif
      )
    );

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData.username, formData.password);

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // const role = response.role || localStorage.getItem('userRole');
      const role = Array.isArray(response.data.user.roles) && response.data.user.roles.length > 0 ? response.data.user.roles[0] : '' || localStorage.getItem('userRole');

      console.log('role', role);

      addNotification('Đăng nhập thành công, đang chuyển hướng!', 'success');
      setTimeout(() => {
        if (role === 'ADMIN') {
          navigate('/dashboard');
        } else {
          navigate('/home_page');
          // localStorage.removeItem('userToken');
          // navigate('/login');
        }
      }, 2000);
    } catch (err) {
      addNotification('Tên đăng nhập hoặc mật khẩu chưa chính xác, vui lòng nhập lại!', 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <main className={styles['login-bg']}>
      <div className={styles['login-form-area']}>
        <form className={styles['login-form']} onSubmit={handleSubmit}>
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

          <div className={styles['login-heading']}>
            <span>Đăng Nhập</span>
            <p>Nhập thông tin đăng nhập để có quyền truy cập</p>
          </div>

          <div className={styles['input-box']}>
            <div className={styles['single-input-fields']}>
              <label htmlFor="username">
                <FontAwesomeIcon icon={faUser} className={styles['input-icon']} />
                Tên đăng nhập/Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập tên đăng nhập/email"
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
              <a href="#" className={styles['f-right']}>
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div className={styles['login-footer']}>
            <p>
              Chưa có tài khoản? <a href="/register">Đăng ký</a> tại đây!
            </p>
            <button type="submit" className={styles['submit-btn3']} disabled={loading}>
              {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
            </button>
          </div>

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