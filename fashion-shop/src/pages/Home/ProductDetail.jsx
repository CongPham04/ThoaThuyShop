import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import MainLayout from "../../layouts/Home/MainLayout";
import axios from "axios";
import items1 from "../../assets/img/logo/placeholder.jpg";

// Create a public axios instance without Authorization header
const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Accept": "application/json",
    "Authorization": undefined,
  },
});

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Giả định trạng thái đăng nhập (thay bằng logic kiểm tra token hoặc context thực tế)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Thay bằng logic thực tế

  // Get productId from URL query parameter
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Không tìm thấy ID sản phẩm.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await publicApi.get(`/api/products/product/${productId}`);
        setProduct(response.data.data);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm.");
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getProductImage = (id) => (id ? `${process.env.REACT_APP_API_URL}/api/products/${id}/image` : items1);
  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // Logic xử lý thêm vào giỏ hàng khi đã đăng nhập (có thể gọi API)
      alert("Chức năng thêm vào giỏ hàng (đã đăng nhập) chưa được triển khai.");
    }
  };

  const handleBuyNowClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // Logic xử lý mua ngay khi đã đăng nhập (có thể gọi API hoặc chuyển hướng)
      alert("Chức năng mua ngay (đã đăng nhập) chưa được triển khai.");
    }
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // Logic xử lý tố cáo khi đã đăng nhập (có thể mở popup hoặc gửi API)
      alert("Chức năng tố cáo (đã đăng nhập) chưa được triển khai.");
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

  // Calculate the original price (before 20% discount)
  const originalPrice = product.price / 0.8;

  return (
    <MainLayout>
      <main className={styles.main}>
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
                    <span className={styles.value}>Chưa có dữ liệu</span>
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