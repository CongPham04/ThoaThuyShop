// Product.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faSearch, 
  faSort, faSortUp, faSortDown, faTimes, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import MainDashboard from '../../layouts/Dashboard/MainDashboard';
import styles from './Product.module.css';
import api from '../../services/api';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    categoryId: '',
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
      'Product already exists': 'Sản phẩm đã tồn tại',
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
        const response = await api.get('/categories/allCategory');
        setCategories(response.data.data);
        setFilteredCategories(response.data.data);
      } catch (err) {
        addNotification('Lỗi: Không lấy được danh sách danh mục!', 'error');
      }
    };

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          addNotification('Không tìm thấy token. Vui lòng đăng nhập.', 'error');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await api.get('/api/products');
        const productsWithImages = await Promise.all(response.data.data.map(async (product) => {
          if (product.imageName) {
            try {
              const imageResponse = await api.get(`/api/products/${product.id}/image`, {
                responseType: 'blob', // Ensure binary data is handled
              });
              const imageUrl = URL.createObjectURL(imageResponse.data);
              return { ...product, imageUrl };
            } catch (err) {
              console.error(`Failed to fetch image for product ${product.id}:`, err);
              return { ...product, imageUrl: null };
            }
          }
          return { ...product, imageUrl: null };
        }));
        setProducts(productsWithImages);
        setLoading(false);
      } catch (err) {
        addNotification('Lỗi: Không lấy được dữ liệu sản phẩm!', 'error');
        setLoading(false);
      }
    };

    fetchCollections();
    fetchCategories();
    fetchProducts();
  }, [navigate]);

  useEffect(() => {
    if (selectedCollection) {
      const filtered = categories.filter(
        (category) => category.collectionId === parseInt(selectedCollection)
      );
      setFilteredCategories(filtered);
      setSelectedCategory(''); // Reset category when collection changes
    } else {
      setFilteredCategories(categories);
    }
  }, [selectedCollection, categories]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = React.useMemo(() => {
    let sortableItems = [...products];
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
  }, [products, sortConfig]);

  const filteredProducts = sortedProducts.filter((product) =>
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory ? product.categoryId === parseInt(selectedCategory) : true)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('price', formData.price);
    formDataToSubmit.append('description', formData.description);
    if (formData.image) {
      formDataToSubmit.append('image', formData.image);
    }
    formDataToSubmit.append('categoryId', formData.categoryId);

    try {
      await api.post('/api/products', formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      addNotification('Thêm sản phẩm thành công!', 'success');
      const response = await api.get('/api/products');
      const productsWithImages = await Promise.all(response.data.data.map(async (product) => {
        if (product.imageName) {
          const imageResponse = await api.get(`/api/products/${product.id}/image`, {
            responseType: 'blob',
          });
          return { ...product, imageUrl: URL.createObjectURL(imageResponse.data) };
        }
        return { ...product, imageUrl: null };
      }));
      setProducts(productsWithImages);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        price: '',
        description: '',
        image: null,
        categoryId: '',
      });
    } catch (err) {
      const rawMessage = err.response?.data?.message || err.message;
      addNotification('Lỗi: ' + translateErrorMessage(rawMessage), 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('price', formData.price);
    formDataToSubmit.append('description', formData.description);
    if (formData.image) {
      formDataToSubmit.append('image', formData.image);
    }
    formDataToSubmit.append('categoryId', formData.categoryId);

    try {
      await api.put(`/api/products/${editingProduct.id}`, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      addNotification('Cập nhật sản phẩm thành công!', 'success');
      const response = await api.get('/api/products');
      const productsWithImages = await Promise.all(response.data.data.map(async (product) => {
        if (product.imageName) {
          const imageResponse = await api.get(`/api/products/${product.id}/image`, {
            responseType: 'blob',
          });
          return { ...product, imageUrl: URL.createObjectURL(imageResponse.data) };
        }
        return { ...product, imageUrl: null };
      }));
      setProducts(productsWithImages);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        image: null,
        categoryId: '',
      });
    } catch (err) {
      addNotification('Lỗi: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      image: null,
      categoryId: product.categoryId || '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await api.delete(`/api/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
        addNotification('Xóa sản phẩm thành công!', 'success');
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
      price: '',
      description: '',
      image: null,
      categoryId: '',
    });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      image: null,
      categoryId: '',
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
          <h1>Quản Lý Sản Phẩm</h1>
          <button 
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm Sản Phẩm
          </button>
        </div>

        <div className={styles.filterContainer}>
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
          <div className={styles.categoryFilter}>
            <label>Lọc theo Danh Mục:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.dropdown}
            >
              <option value="">Tất cả</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.searchBar}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Tên Sản Phẩm <FontAwesomeIcon icon={getSortIcon('name')} />
                </th>
                <th>Hình Ảnh</th>
                <th onClick={() => requestSort('price')}>
                  Giá <FontAwesomeIcon icon={getSortIcon('price')} />
                </th>
                <th onClick={() => requestSort('description')}>
                  Mô Tả <FontAwesomeIcon icon={getSortIcon('description')} />
                </th>
                <th onClick={() => requestSort('categoryName')}>
                  Danh Mục <FontAwesomeIcon icon={getSortIcon('categoryName')} />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className={styles.productImage}
                          onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} // Fallback image
                        />
                      ) : (
                        <span>Không có ảnh</span>
                      )}
                    </td>
                    <td>{product.price}<span>.000</span></td>
                    <td>{product.description || 'N/A'}</td>
                    <td>{product.categoryName}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(product)}
                        className={styles.editButton}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className={styles.deleteButton}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.noResults}>
                    Không tìm thấy sản phẩm
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
              <h2>Thêm Sản Phẩm Mới</h2>
              <form onSubmit={handleAddSubmit}>
                <div className={styles.formGroup}>
                  <label>Tên Sản Phẩm:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giá:</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Mô Tả:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Hình Ảnh:</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Danh Mục:</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
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
              <h2>Chỉnh Sửa Sản Phẩm</h2>
              <form onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label>Tên Sản Phẩm:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Giá:</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Mô Tả:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Hình Ảnh (Thay đổi nếu cần):</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Danh Mục:</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
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

export default Product;