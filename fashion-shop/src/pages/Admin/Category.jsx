// Category.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faSearch, 
  faSort, faSortUp, faSortDown, faTimes, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import MainDashboard from '../../layouts/Dashboard/MainDashboard';
import styles from './Category.module.css';
import api from '../../services/api';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    collectionId: '',
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
      'Category already exists': 'Danh mục đã tồn tại',
      'Internal Server Error': 'Lỗi máy chủ',
    };
    return translations[message] || 'Đã xảy ra lỗi không xác định';
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get('/collections/allCollections');
        setCollections(response.data.data);
      } catch (err) {
        addNotification('Lỗi: Không lấy được danh sách bộ sưu tập!', 'error');
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          addNotification('Không tìm thấy token. Vui lòng đăng nhập.', 'error');
          setLoading(false);
          navigate('/login');
          return;
        }

        let response;
        if (selectedCollection) {
          response = await api.get(`/categories/collection/${selectedCollection}`);
        } else {
          response = await api.get('/categories/allCategory');
        }
        setCategories(response.data.data);
        setLoading(false);
      } catch (err) {
        addNotification('Lỗi: Không lấy được dữ liệu danh mục!', 'error');
        setLoading(false);
      }
    };

    fetchCollections();
    fetchCategories();
  }, [navigate, selectedCollection]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = React.useMemo(() => {
    let sortableItems = [...categories];
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
  }, [categories, sortConfig]);

  const filteredCategories = sortedCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories/addCategory', formData);
      addNotification('Thêm danh mục thành công!', 'success');
      const response = selectedCollection
        ? await api.get(`/categories/collection/${selectedCollection}`)
        : await api.get('/categories/allCategory');
      setCategories(response.data.data);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        collectionId: '',
      });
    } catch (err) {
      const rawMessage = err.response?.data?.message || err.message;
      addNotification('Lỗi: ' + translateErrorMessage(rawMessage), 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/categories/${editingCategory.id}`, formData);
      addNotification('Cập nhật danh mục thành công!', 'success');
      const response = selectedCollection
        ? await api.get(`/categories/collection/${selectedCollection}`)
        : await api.get('/categories/allCategory');
      setCategories(response.data.data);
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        collectionId: '',
      });
    } catch (err) {
      addNotification('Lỗi: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      collectionId: category.collectionId || '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
        addNotification('Xóa danh mục thành công!', 'success');
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
      name: '',
      collectionId: '',
    });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      collectionId: '',
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
          <h1>Quản Lý Danh Mục</h1>
          <button 
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm Danh Mục
          </button>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.searchBar}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.collectionFilter}>
            <label>Lọc theo Bộ Sưu Tập:</label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className={styles.dropdown}
            >
              <option value="">Tất cả</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.categoryTable}>
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Tên Danh Mục <FontAwesomeIcon icon={getSortIcon('name')} />
                </th>
                <th onClick={() => requestSort('collectionName')}>
                  Bộ Sưu Tập <FontAwesomeIcon icon={getSortIcon('collectionName')} />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.collectionName}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(category)}
                        className={styles.editButton}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className={styles.deleteButton}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={styles.noResults}>
                    Không tìm thấy danh mục
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
              <h2>Thêm Danh Mục Mới</h2>
              <form onSubmit={handleAddSubmit}>
                <div className={styles.formGroup}>
                  <label>Tên Danh Mục:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Bộ Sưu Tập:</label>
                  <select
                    name="collectionId"
                    value={formData.collectionId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn bộ sưu tập</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
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
              <h2>Chỉnh Sửa Danh Mục</h2>
              <form onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label>Tên Danh Mục:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Bộ Sưu Tập:</label>
                  <select
                    name="collectionId"
                    value={formData.collectionId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn bộ sưu tập</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
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

export default Category;