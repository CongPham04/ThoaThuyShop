import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faSearch, 
  faSort, faSortUp, faSortDown, faTimes, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import MainDashboard from '../../layouts/Dashboard/MainDashboard';
import styles from './Customer.module.css';
import api from '../../services/api';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    dob: '',
    gender: '', // Initialize as empty string to avoid null
    password: '',
    confirmPassword: '',
    roles: [],
  });

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

  const translateErrorMessage = (message) => {
    const translations = {
      'Username already exists': 'Tên người dùng đã tồn tại',
      'Email already exists': 'Email đã tồn tại',
      'Invalid password': 'Mật khẩu không hợp lệ',
      'User not found': 'Không tìm thấy người dùng',
      'Internal Server Error': 'Lỗi máy chủ',
      'Password must be at least 8 characters': 'Mật khẩu phải có ít nhất 8 ký tự',
    };
  
    return translations[message] || 'Đã xảy ra lỗi không xác định';
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          addNotification('Không tìm thấy token. Vui lòng đăng nhập.', 'error');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await api.get('/users/allUsers');
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        addNotification('Lỗi: Không lấy được dữ liệu! Kiểm tra lại máy chủ', 'error');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [navigate]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = React.useMemo(() => {
    let sortableItems = [...customers];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] || ''; // Handle null/undefined for sorting
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [customers, sortConfig]);

  const filteredCustomers = sortedCustomers.filter((customer) =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: [value],
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addNotification('Mật khẩu và xác nhận mật khẩu không khớp!', 'error');
      return;
    }

    try {
      const { confirmPassword, ...dataToSubmit } = formData;
      // Log data to verify gender is included
      console.log('Sending data to POST /users/addUser:', dataToSubmit);
      await api.post('/users/addUser', dataToSubmit);
      addNotification('Thêm thành công!', 'success');
      const response = await api.get('/users/allUsers');
      setCustomers(response.data);
      setIsAddModalOpen(false);
      setFormData({
        username: '',
        firstname: '',
        lastname: '',
        dob: '',
        gender: '',
        password: '',
        confirmPassword: '',
        roles: [],
      });
    } catch (err) {
      const rawMessage = err.response?.data?.message || err.message;
      addNotification('Lỗi: ' + translateErrorMessage(rawMessage), 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        password: formData.password || undefined, // Send undefined if password is empty
      };
      // Log data to verify gender is included
      console.log('Sending data to PUT /users/', editingCustomer.id, ':', dataToSubmit);
      await api.put(`/users/${editingCustomer.id}`, dataToSubmit);
      addNotification('Cập nhật thành công!', 'success');
      const response = await api.get('/users/allUsers');
      setCustomers(response.data);
      setIsEditModalOpen(false);
      setEditingCustomer(null);
      setFormData({
        username: '',
        firstname: '',
        lastname: '',
        dob: '',
        gender: '',
        password: '',
        confirmPassword: '',
        roles: [],
      });
    } catch (err) {
      addNotification('Lỗi: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      username: customer.username || '',
      firstname: customer.firstname || '',
      lastname: customer.lastname || '',
      dob: customer.dob ? customer.dob.toString().split('T')[0] : '',
      gender: customer.gender || '', // Convert null to empty string
      password: '',
      confirmPassword: '',
      roles: [...(customer.roles || [])],
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
      try {
        await api.delete(`/users/${id}`);
        setCustomers(customers.filter((customer) => customer.id !== id));
        addNotification('Xóa khách hàng thành công!', 'success');
      } catch (err) {
        addNotification('Lỗi: ' + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setFormData({
      username: '',
      firstname: '',
      lastname: '',
      dob: '',
      gender: '',
      password: '',
      confirmPassword: '',
      roles: [],
    });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingCustomer(null);
    setFormData({
      username: '',
      firstname: '',
      lastname: '',
      dob: '',
      gender: '',
      password: '',
      confirmPassword: '',
      roles: [],
    });
  };

  if (loading) return (
    <MainDashboard>
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingIcon} />
        <span>Đang tải...</span>
      </div>
    </MainDashboard>
  );

  return (
    <MainDashboard>
      <div className={styles.container}>
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

        <div className={styles.header}>
          <h1>Thông Tin Khách Hàng</h1>
          <button 
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm Khách Hàng
          </button>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm tên đăng nhập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.customerTable}>
            <thead>
              <tr>
                <th onClick={() => requestSort('username')}>
                  Tên Đăng Nhập <FontAwesomeIcon icon={getSortIcon('username')} />
                </th>
                <th onClick={() => requestSort('firstname')}>
                  Tên <FontAwesomeIcon icon={getSortIcon('firstname')} />
                </th>
                <th onClick={() => requestSort('lastname')}>
                  Họ <FontAwesomeIcon icon={getSortIcon('lastname')} />
                </th>
                <th onClick={() => requestSort('dob')}>
                  Ngày Sinh <FontAwesomeIcon icon={getSortIcon('dob')} />
                </th>
                <th onClick={() => requestSort('gender')}>
                  Giới Tính <FontAwesomeIcon icon={getSortIcon('gender')} />
                </th>
                <th>Vai Trò</th>
                <th>Mật Khẩu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.username}</td>
                    <td>{customer.firstname}</td>
                    <td>{customer.lastname}</td>
                    <td>{customer.dob ? customer.dob.toString().split('T')[0] : ''}</td>
                    <td>
                      {customer.gender === 'MALE' ? 'Nam' : 
                       customer.gender === 'FEMALE' ? 'Nữ' : 
                       customer.gender === 'OTHER' ? 'Khác' : ''}
                    </td>
                    <td>
                      <div className={styles.rolesContainer}>
                        {customer.roles.map((role) => (
                          <span key={role} className={styles.roleBadge}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{customer.password ? '********' : ''}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(customer)}
                        className={styles.editButton}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleDelete(customer.id)}
                        className={styles.deleteButton}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className={styles.noResults}>
                    Không tìm thấy khách hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isAddModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.modalCloseButton} onClick={handleAddModalClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2>Thêm Khách Hàng Mới</h2>
              <form onSubmit={handleAddSubmit}>
                <div className={styles.formGroup}>
                  <label>Tên Đăng Nhập:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tên:</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Họ:</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ngày sinh:</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giới tính:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Mật khẩu mới:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Xác nhận mật khẩu mới:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Vai Trò:</label>
                  <div className={styles.rolesRadio}>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="ADMIN"
                        checked={formData.roles.includes('ADMIN')}
                        onChange={handleRoleChange}
                        required
                      />
                      ADMIN
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="USER"
                        checked={formData.roles.includes('USER')}
                        onChange={handleRoleChange}
                        required
                      />
                      USER
                    </label>
                  </div>
                </div>
                <div className={styles.modalButtons}>
                  <button type="submit" className={styles.saveButton}>
                    Lưu
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleAddModalClose}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.modalCloseButton} onClick={handleEditModalClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2>Chỉnh Sửa Khách Hàng</h2>
              <form onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label>Tên Đăng Nhập:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tên:</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Họ:</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ngày Sinh:</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giới tính:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Mật khẩu mới:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu mới (Bỏ trống nếu không thay đổi)"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Vai Trò:</label>
                  <div className={styles.rolesRadio}>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="ADMIN"
                        checked={formData.roles.includes('ADMIN')}
                        onChange={handleRoleChange}
                        required
                      />
                      ADMIN
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="USER"
                        checked={formData.roles.includes('USER')}
                        onChange={handleRoleChange}
                        required
                      />
                      USER
                    </label>
                  </div>
                </div>
                <div className={styles.modalButtons}>
                  <button type="submit" className={styles.saveButton}>
                    Cập Nhật
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleEditModalClose}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainDashboard>
  );
};

export default Customer;