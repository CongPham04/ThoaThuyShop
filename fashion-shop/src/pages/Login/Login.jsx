import React, { useState } from 'react';
import styles from './Login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);
    
  //   try {
  //     const response = await authService.login(formData.username, formData.password);
  //     console.log(response); 
  //     // Nếu có rememberMe, lưu thông tin vào localStorage
  //     if (formData.rememberMe) {
  //       localStorage.setItem('rememberMe', 'true');
  //     } else {
  //       localStorage.removeItem('rememberMe');
  //     }
      
  //     // Chuyển hướng sau khi đăng nhập thành công
  //     navigate('/dashboard'); // Thay đổi route tùy theo ứng dụng của bạn
      
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
        navigate('/dashboard');
      } else {
        navigate('/home_page');
      }
  
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu chưa chính xác" || 'Đăng nhập thất bại. Vui lòng thử lại.');
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
          {/* Login Heading */}
          <div className={styles['login-heading']}>
            <span>Đăng Nhập</span>
            <p>Nhập thông tin đăng nhập để có quyền truy cập</p>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className={styles['error-message']}>
              {error}
            </div>
          )}

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