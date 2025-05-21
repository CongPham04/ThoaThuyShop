import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSpinner, faTimes, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import MainLayout from "../../layouts/Users/MainLayout";
import api from "../../services/api";
import placeholderImg from "../../assets/img/logo/placeholder.jpg";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

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
    const fetchProduct = async () => {
      if (!productId) {
        setError("Không tìm thấy ID sản phẩm.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/products/product/${productId}`);
        if (response.data.code === 1000) {
          setProduct(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm.");
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getProductImage = (id) => (id ? `${api.getUri()}/api/products/${id}/image` : placeholderImg);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCartClick = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        addNotification('Không tìm thấy token. Vui lòng đăng nhập.', 'error');
        navigate('/login');
        return;
      }

      if (!productId || quantity <= 0) {
        addNotification('Lỗi: Vui lòng chọn số lượng hợp lệ và kiểm tra sản phẩm.', 'error');
        return;
      }

      setLoading(true);
      const response = await api.post('api/cart/add', { productId: Number(productId), quantity });
      if (response.data.code === 1000) {
        addNotification("Sản phẩm đã được thêm vào giỏ hàng thành công!");
        // Delay reload to show notification
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 2-second delay
      } else {
        addNotification(response.data.message || 'Lỗi: Không thể thêm vào giỏ hàng.', 'error');
      }
    } catch (err) {
      addNotification('Lỗi: Không thể thêm sản phẩm vào giỏ hàng. Kiểm tra lại máy chủ.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNowClick = () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }
      navigate('/checkout', { state: { product, quantity } });
    } catch (err) {
      addNotification('Lỗi: Không lấy được dữ liệu! Kiểm tra lại máy chủ', 'error');
    }
  };

  const handleReportClick = () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }
      addNotification("Chức năng TỐ CÁO chưa được triển khai.");
    } catch (err) {
      addNotification('Lỗi: Không lấy được dữ liệu! Kiểm tra lại máy chủ', 'error');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingIcon} />
          <span>Đang tải...</span>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className={styles.error}>{error || "Không tìm thấy sản phẩm."}</div>
      </MainLayout>
    );
  }

  const originalPrice = product.price / 0.8;

  return (
    <MainLayout>
      <main className={styles.main}>
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
        <div className={styles.productDetailArea}>
          <div className={styles.container}>
            <div className={styles.productOverview}>
              <div className={styles.productImages}>
                <div className={styles.mainImage}>
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.thumbnailImages}>
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                    className={styles.thumbnail}
                  />
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                    className={styles.thumbnail}
                  />
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                    className={styles.thumbnail}
                  />
                </div>
              </div>
              <div className={styles.productInfo}>
                <h1 className={styles.productName}>{product.name}</h1>
                <div className={styles.productStats}>
                  <span className={styles.statItem}>Đánh giá: Chưa có dữ liệu</span>
                  <span className={styles.statItem}>Đã bán: Chưa có dữ liệu</span>
                  <span className={styles.reportLink} onClick={handleReportClick}>Tố cáo</span>
                </div>
                <div className={styles.priceSection}>
                  <span className={styles.currentPrice}>
                    ₫{Math.round(product.price).toLocaleString()}
                  </span>
                  <span className={styles.originalPrice}>
                    ₫{Math.round(originalPrice).toLocaleString()}
                  </span>
                  <span className={styles.discountLabel}>-20%</span>
                </div>
                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Vận chuyển:</span>
                    <span className={styles.value}>Chưa có dữ liệu</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Màu sắc:</span>
                    <span className={styles.value}>Chưa có dữ liệu</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Size:</span>
                    <span className={styles.value}>Chưa có dữ liệu</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Số lượng:</span>
                    <div className={styles.quantityContainer}>
                      <button
                        className={styles.quantityButton}
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className={styles.quantityValue}>{quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={handleIncreaseQuantity}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.buttons}>
                  <button className={styles.addToCartButton} onClick={handleAddToCartClick}>
                    <FontAwesomeIcon icon={faShoppingCart} /> Thêm vào giỏ hàng
                  </button>
                  <button className={styles.buyNowButton} onClick={handleBuyNowClick}>Mua ngay</button>
                </div>
              </div>
            </div>
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionTitle}>Mô tả sản phẩm</h2>
              <p className={styles.description}>{product.description || "Không có mô tả."}</p>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default ProductDetail;