import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import authService from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, exiting: true } : n)));
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 300);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      addNotification('Mật khẩu và xác nhận mật khẩu không khớp', 'error');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSubmit } = formData;
      await authService.register(dataToSubmit);
      addNotification('Đăng ký thành công!', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      addNotification(
        err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${styles['login-bg']} d-flex align-items-center justify-content-center min-vh-100`}>
      <div className={`${styles['register-form-area']} bg-white p-4 rounded shadow`}>
        <div className={styles['login-form']}>
          <div className={styles['login-heading']}>
            <span>Đăng Ký</span>
            <p>Tạo tài khoản để truy cập website Thoa Thuy Shop</p>
          </div>
          <form onSubmit={handleSubmit} className={styles['input-box']}>
            <div className={`row ${styles['name-row']}`}>
              <div className="col-6">
                <div className={styles['single-input-fields']}>
                  <label htmlFor="firstname" className="form-label">Tên</label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="Tên"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className={styles['single-input-fields']}>
                  <label htmlFor="lastname" className="form-label">Họ</label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Họ"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className={styles['single-input-fields']}>
                <label htmlFor="gender" className="form-label">Giới tính</label>
                <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                </select>
                </div>
            <div className={styles['single-input-fields']}>
              <label htmlFor="dob" className="form-label">Ngày sinh</label>
              <input
                type="date"
                name="dob"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className={styles['single-input-fields']}>
              <label htmlFor="username" className="form-label">Tên đăng nhập/Email</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Nhập tên đăng nhập/email"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className={styles['single-input-fields']}>
              <label htmlFor="password" className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className={styles['single-input-fields']}>
              <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className={styles['login-footer']}>
              <button
                type="submit"
                className={`${styles['submit-btn3']} w-100`}
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
              </button>
              <p className="text-center mt-3">
                Đã có tài khoản?{' '}
                <a href="/login" className="text-decoration-none">Đăng nhập</a>
              </p>
            </div>
          </form>
          <div className={styles.notificationContainer}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notification} ${styles[notification.type]} ${
                  notification.exiting ? styles.exiting : ''
                } d-flex justify-content-between align-items-center`}
              >
                {notification.message}
                <button
                  className={styles.closeButton}
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== notification.id)
                    )
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;