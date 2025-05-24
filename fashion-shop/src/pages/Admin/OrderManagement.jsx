import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSort, 
  faSortUp, 
  faSortDown, 
  faTimes, 
  faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import MainDashboard from '../../layouts/Dashboard/MainDashboard';
import styles from './OrderManagement.module.css';
import api from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          addNotification('Không tìm thấy token. Vui lòng đăng nhập.', 'error');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await api.get('/api/orders/admin');
        const ordersWithDetails = await Promise.all(response.data.data.map(async (order) => {
          // Lấy thông tin sản phẩm
          const itemsWithProductNames = await Promise.all(order.items.map(async (item) => {
            const productResponse = await api.get(`/api/products/product/${item.productId}`);
            return { ...item, productName: productResponse.data.data.name };
          }));

          // Lấy thông tin username từ userId
          let username = 'N/A';
          try {
            const userResponse = await api.get(`/users/${order.userId}`);
            username = userResponse.data.data.username || 'N/A';
          } catch (err) {
            console.error(`Lỗi khi lấy thông tin user ${order.userId}:`, err);
          }

          return { ...order, items: itemsWithProductNames, username };
        }));
        setOrders(ordersWithDetails);
        setLoading(false);
      } catch (err) {
        addNotification('Lỗi: Không lấy được dữ liệu đơn hàng!', 'error');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    let sortableItems = [...orders];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
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
  }, [orders, sortConfig]);

  const filteredOrders = sortedOrders.filter((order) =>
    (order.id.toString().includes(searchTerm) ||
    (order.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.shippingInfo?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.shippingInfo?.phoneNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.shippingInfo?.address || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      try {
        await api.delete(`/api/orders/${orderId}/cancel-by-admin`);
        setOrders(orders.filter((order) => order.id !== orderId));
        addNotification('Hủy đơn hàng thành công!', 'success');
      } catch (err) {
        addNotification('Lỗi: ' + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/confirm`);
      setOrders(orders.map((order) =>
        order.id === orderId ? { ...order, status: 'confirmed' } : order
      ));
      addNotification('Xác nhận đơn hàng thành công!', 'success');
    } catch (err) {
      addNotification('Lỗi: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

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
          <h1>Quản Lý Đơn Hàng</h1>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.searchBar}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th onClick={() => requestSort('id')}>
                  ID Đơn Hàng <FontAwesomeIcon icon={getSortIcon('id')} />
                </th>
                <th onClick={() => requestSort('createdAt')}>
                  Ngày Tạo <FontAwesomeIcon icon={getSortIcon('createdAt')} />
                </th>
                <th onClick={() => requestSort('status')}>
                  Trạng Thái <FontAwesomeIcon icon={getSortIcon('status')} />
                </th>
                <th onClick={() => requestSort('username')}>
                  Khách Hàng <FontAwesomeIcon icon={getSortIcon('username')} />
                </th>
                <th>Sản Phẩm</th>
                <th>Số Lượng</th>
                <th onClick={() => requestSort('totalPrice')}>
                  Tổng Giá <FontAwesomeIcon icon={getSortIcon('totalPrice')} />
                </th>
                <th>Tên Người Nhận</th>
                <th>Số Điện Thoại</th>
                <th>Địa Chỉ</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.status}</td>
                    <td>{order.username}</td>
                    <td>{order.items.map(item => item.productName).join(', ')}</td>
                    <td>{order.items.map(item => item.quantity).join(', ')}</td>
                    <td>{order.totalPrice.toString()}.000</td>
                    <td>{order.shippingInfo?.fullName || 'N/A'}</td>
                    <td>{order.shippingInfo?.phoneNumber || 'N/A'}</td>
                    <td>{order.shippingInfo?.address || 'N/A'}</td>
                    <td>
                      {order.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className={styles.cancelButton}
                          >
                            Hủy
                          </button>
                          <button 
                            onClick={() => handleConfirmOrder(order.id)}
                            className={styles.confirmButton}
                          >
                            Xác nhận đơn
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className={styles.noResults}>
                    Không tìm thấy đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainDashboard>
  );
};

export default OrderManagement;