import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faSearch, 
  faSort, faSortUp, faSortDown, faTimes, faSpinner, 
  faTruckLoading
} from '@fortawesome/free-solid-svg-icons';
import MainDashboard from '../../layouts/Dashboard/MainDashboard';
import styles from './Customer.module.css';
import axios from 'axios';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Form state including password
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    dob: '',
    password: '', // Thêm trường password
    roles: []
  });

  // Retrieve token from localStorage
  const token = localStorage.getItem('userToken');
  console.log('Token:', token);

  // Create axios instance with token
  const api = axios.create({
    baseURL: 'http://localhost:8080/identify',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  // Hàm thêm thông báo
  const addNotification = (message, type = 'success') => {
    setNotifications([]); // Xóa tất cả thông báo hiện tại
    const id = Date.now();
    setNotifications([{ id, message, type, isExiting: false }]);

    setTimeout(() => {
      handleRemoveNotification(id);
    }, 6000);
  };

  // Hàm xử lý xóa thông báo với hiệu ứng
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

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
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
        if (err.response?.status === 401) {
          navigate('/login');
          addNotification('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', 'error');
          localStorage.removeItem('userToken');
        } else {
          addNotification('Lỗi: Không lấy được dữ liệu!', 'error');
        }
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token, navigate]);

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedCustomers = React.useMemo(() => {
    let sortableItems = [...customers];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [customers, sortConfig]);

  // Filter by search term
  const filteredCustomers = sortedCustomers.filter(customer => 
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle role changes
  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, value] 
        : prev.roles.filter(role => role !== value)
    }));
  };

  // Submit form (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/users/${editingCustomer.id}`, {
          ...formData,
          password: formData.password || editingCustomer.password // Giữ password cũ nếu không thay đổi
        });
        addNotification('Cập nhật khách hàng thành công!', 'success');
      } else {
        await api.post('/users', formData);
        addNotification('Thêm khách hàng thành công!', 'success');
      }
      const response = await api.get('/users/allUsers');
      setCustomers(response.data);
      setIsModalOpen(false);
      setEditingCustomer(null);
      setFormData({
        username: '',
        firstname: '',
        lastname: '',
        dob: '',
        password: '', // Reset password
        roles: []
      });
    } catch (err) {
      if (err.response?.status === 401) {
        addNotification('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', 'error');
        localStorage.removeItem('userToken');
        navigate('/login');
      } else {
        addNotification('Lỗi: ' + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  // Edit customer
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      username: customer.username,
      firstname: customer.firstname,
      lastname: customer.lastname,
      dob: customer.dob ? customer.dob.toString().split('T')[0] : '',
      password: '', // Không hiển thị password cũ, để người dùng nhập lại nếu muốn thay đổi
      roles: [...customer.roles]
    });
    setIsModalOpen(true);
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
      try {
        await api.delete(`/users/${id}`);
        setCustomers(customers.filter(customer => customer.id !== id));
        addNotification('Xóa khách hàng thành công!', 'success');
      } catch (err) {
        if (err.response?.status === 401) {
          addNotification('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', 'error');
          localStorage.removeItem('userToken');
          navigate('/login');
        } else {
          addNotification('Lỗi: ' + err.message, 'error');
        }
      }
    }
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
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

        <div className={styles.header}>
          <h1>Thông Tin Khách Hàng</h1>
          <button 
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm Khách Hàng
          </button>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
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
                  Tài Khoản <FontAwesomeIcon icon={getSortIcon('username')} />
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
                <th>Vai Trò</th>
                <th>Mật Khẩu</th> {/* Thêm cột mật khẩu */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td>{customer.username}</td>
                    <td>{customer.firstname}</td>
                    <td>{customer.lastname}</td>
                    <td>{customer.dob ? customer.dob.toString().split('T')[0] : ''}</td>
                    <td>
                      <div className={styles.rolesContainer}>
                        {customer.roles.map(role => (
                          <span key={role} className={styles.roleBadge}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{customer.password ? '********' : ''}</td> {/* Ẩn mật khẩu */}
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
                  <td colSpan="7" className={styles.noResults}>
                    Không tìm thấy khách hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>{editingCustomer ? 'Chỉnh Sửa Khách Hàng' : 'Thêm Khách Hàng Mới'}</h2>
              <form onSubmit={handleSubmit}>
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
                  <label>Mật Khẩu:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu (bỏ trống nếu không thay đổi)"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Vai Trò:</label>
                  <div className={styles.rolesCheckbox}>
                    <label>
                      <input
                        type="checkbox"
                        value="ADMIN"
                        checked={formData.roles.includes('ADMIN')}
                        onChange={handleRoleChange}
                      />
                      ADMIN
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="USER"
                        checked={formData.roles.includes('USER')}
                        onChange={handleRoleChange}
                      />
                      USER
                    </label>
                  </div>
                </div>
                <div className={styles.modalButtons}>
                  <button type="submit" className={styles.saveButton}>
                    {editingCustomer ? 'Cập Nhật' : 'Lưu'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCustomer(null);
                      setFormData({
                        username: '',
                        firstname: '',
                        lastname: '',
                        dob: '',
                        password: '',
                        roles: []
                      });
                    }}
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