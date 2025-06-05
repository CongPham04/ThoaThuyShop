import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEdit, faSave, faTimes, faEye, faEyeSlash,
  faSpinner, faCheck, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Users/Headers/Header';
import Footer from '../../components/Users/Footers/Footer';
import userService from '../../services/userService';
import styles from './UserInfo.module.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Add notification
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, isExiting: false }]);

    setTimeout(() => {
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isExiting: true } : notif
        )
      );

      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      }, 300);
    }, 5000);
  };

  // Load user information
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        const response = await userService.getMyInfo();
        
        if (response.code === 1000 && response.data) {
          const userData = userService.formatUserData(response.data);
          setUserInfo(userData);
          setFormData({
            firstname: userData.firstname || '',
            lastname: userData.lastname || '',
            dob: userData.dob || '',
            gender: userData.gender || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          addNotification('Không thể tải thông tin người dùng', 'error');
        }
      } catch (error) {
        addNotification(error.message || 'Lỗi khi tải thông tin người dùng', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'Tên không được để trống';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Họ không được để trống';
    }

    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        newErrors.dob = 'Vui lòng nhập ngày sinh hợp lệ';
      }
    }

    if (isChangingPassword) {
      if (!formData.newPassword) {
        newErrors.newPassword = 'Mật khẩu mới không được để trống';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save changes
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        dob: formData.dob || null,
        gender: formData.gender || null
      };

      // Add password if changing
      if (isChangingPassword && formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await userService.updateMyInfo(updateData);

      if (response) {
        // Reload user info
        const updatedResponse = await userService.getMyInfo();
        if (updatedResponse.code === 1000 && updatedResponse.data) {
          const userData = userService.formatUserData(updatedResponse.data);
          setUserInfo(userData);
        }

        addNotification('Cập nhật thông tin thành công!', 'success');
        setIsEditing(false);
        setIsChangingPassword(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      addNotification(error.message || 'Lỗi khi cập nhật thông tin', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    if (userInfo) {
      setFormData({
        firstname: userInfo.firstname || '',
        lastname: userInfo.lastname || '',
        dob: userInfo.dob || '',
        gender: userInfo.gender || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setIsEditing(false);
    setIsChangingPassword(false);
    setErrors({});
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingIcon} />
          <p>Đang tải thông tin...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      {/* Notifications */}
      <div className={styles.notificationContainer}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`${styles.notification} ${styles[notification.type]} ${
              notification.isExiting ? styles.exiting : ''
            }`}
          >
            <FontAwesomeIcon 
              icon={notification.type === 'success' ? faCheck : faExclamationTriangle} 
              className={styles.notificationIcon}
            />
            <span>{notification.message}</span>
          </div>
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.userInfoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerLeft}>
              <FontAwesomeIcon icon={faUser} className={styles.headerIcon} />
              <h2>Thông Tin Cá Nhân</h2>
            </div>
            <div className={styles.headerRight}>
              {!isEditing ? (
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Chỉnh Sửa
                </button>
              ) : (
                <div className={styles.actionButtons}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faSave} />
                    )}
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.formGrid}>
              {/* Username (Read-only) */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Tên Đăng Nhập</label>
                <input
                  type="text"
                  value={userInfo?.username || ''}
                  className={`${styles.input} ${styles.readOnly}`}
                  readOnly
                />
                <small className={styles.helpText}>Tên đăng nhập không thể thay đổi</small>
              </div>

              {/* First Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.firstname ? styles.error : ''}`}
                  readOnly={!isEditing}
                  placeholder="Nhập tên của bạn"
                />
                {errors.firstname && (
                  <span className={styles.errorText}>{errors.firstname}</span>
                )}
              </div>

              {/* Last Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Họ <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.lastname ? styles.error : ''}`}
                  readOnly={!isEditing}
                  placeholder="Nhập họ của bạn"
                />
                {errors.lastname && (
                  <span className={styles.errorText}>{errors.lastname}</span>
                )}
              </div>

              {/* Date of Birth */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày Sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.dob ? styles.error : ''}`}
                  readOnly={!isEditing}
                />
                {errors.dob && (
                  <span className={styles.errorText}>{errors.dob}</span>
                )}
              </div>

              {/* Gender */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Giới Tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={styles.input}
                  disabled={!isEditing}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>

              {/* Roles (Read-only) */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Vai Trò</label>
                <input
                  type="text"
                  value={userInfo?.rolesDisplay || ''}
                  className={`${styles.input} ${styles.readOnly}`}
                  readOnly
                />
              </div>
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className={styles.passwordSection}>
                <div className={styles.passwordHeader}>
                  <h3>Đổi Mật Khẩu</h3>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isChangingPassword}
                      onChange={(e) => setIsChangingPassword(e.target.checked)}
                    />
                    Tôi muốn đổi mật khẩu
                  </label>
                </div>

                {isChangingPassword && (
                  <div className={styles.passwordFields}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Mật Khẩu Mới <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.passwordInputWrapper}>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={`${styles.input} ${errors.newPassword ? styles.error : ''}`}
                          placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                      {errors.newPassword && (
                        <span className={styles.errorText}>{errors.newPassword}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Xác Nhận Mật Khẩu Mới <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.passwordInputWrapper}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                          placeholder="Nhập lại mật khẩu mới"
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className={styles.errorText}>{errors.confirmPassword}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserInfo; 