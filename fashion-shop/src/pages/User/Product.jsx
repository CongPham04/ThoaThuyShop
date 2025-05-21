import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart, faSearchPlus, faSpinner, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./Product.module.css";
import MainLayout from "../../layouts/Users/MainLayout";
import api from "../../services/api";
import placeholderImg from "../../assets/img/logo/placeholder.jpg";

const PRODUCTS_PER_PAGE = 9;

// Define price ranges (in VND)
const PRICE_RANGES = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 500.000đ", min: 0, max: 500000 },
  { label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000 },
  { label: "1.000.000đ - 2.000.000đ", min: 1000000, max: 2000000 },
  { label: "Trên 2.000.000đ", min: 2000000, max: Infinity },
];

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);

  const params = new URLSearchParams(window.location.search);
  const collectionId = params.get("collectionId") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/categories/collection/${collectionId}`);
        const fetchedCategories = response.data.data || [];
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id.toString());
        }
      } catch (err) {
        setError("Không thể tải danh mục.");
        console.error("Fetch categories error:", err);
      }
    };

    if (collectionId) {
      fetchCategories();
    } else {
      setLoading(false);
      setError("Không tìm thấy collectionId.");
    }
  }, [collectionId]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;

      try {
        setLoading(true);
        const response = await api.get(`/api/products/allProducts/${selectedCategory}`);
        setProducts(response.data.data || []);
        setCurrentPage(1);
      } catch (err) {
        setError("Không thể tải sản phẩm.");
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const range = PRICE_RANGES[selectedPriceRange];
    const filtered = products.filter(
      (product) => product.price >= range.min && product.price < range.max
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedPriceRange]);

  const getProductImage = (id) => (id ? `${api.getUri()}/api/products/${id}/image` : placeholderImg);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={currentPage === 1 ? styles.activePage : ""}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="start-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? styles.activePage : ""}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="end-ellipsis">...</span>);
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? styles.activePage : ""}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
            <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {pageNumbers}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
            <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    );
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

  return (
    <MainLayout>
      <main className={styles.main} key="products-page">
        <div className={styles.listingArea}>
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-4">
                <div className={styles.categoryListing}>
                  <div className={styles.singleListing}>
                    <div className={styles.selectCategories}>
                      <label className={styles.label}>Danh Mục:</label>
                      <div className={styles.selectJobItems}>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          disabled={loading || categories.length === 0}
                        >
                          {categories.length === 0 ? (
                            <option value="">Không có danh mục</option>
                          ) : (
                            categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                    <div className={styles.selectPriceRange}>
                      <label className={styles.label}>Lựa Chọn Giá Phù Hợp:</label>
                      <div className={styles.selectJobItems}>
                        <select
                          value={selectedPriceRange}
                          onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                        >
                          {PRICE_RANGES.map((range, index) => (
                            <option key={index} value={index}>
                              {range.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-9 col-lg-8 col-md-8">
                <div className={styles.latestItems}>
                  {error ? (
                    <div className={styles.error}>{error}</div>
                  ) : currentProducts.length === 0 ? (
                    <div className={styles.noProducts}>Không tìm thấy sản phẩm nào.</div>
                  ) : (
                    <>
                      <div className="row">
                        {currentProducts.map((product) => {
                          // Calculate the original price (before 20% discount)
                          const originalPrice = product.price / 0.8; // Since current price is 80% of original (20% discount)
                          return (
                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6" key={product.id}>
                              <div className={styles.properties}>
                                <div className={styles.propertiesCard}>
                                  <div className={styles.propertiesImg}>
                                    <a href={`/products-details_user?id=${product.id}`}>
                                      <img
                                        src={getProductImage(product.id)}
                                        alt={product.name}
                                        onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                                        className={styles.productImage}
                                      />
                                    </a>
                                    <div className={styles.socialIcon}>
                                      <a href={`/products-details_user?id=${product.id}`} ><FontAwesomeIcon icon={faShoppingCart} /></a>
                                      <a href=""><FontAwesomeIcon icon={faHeart} /></a>
                                      <a href={`/products-details_user?id=${product.id}`}>
                                        <FontAwesomeIcon icon={faSearchPlus} />
                                      </a>
                                    </div>
                                  </div>
                                  <div className={styles.propertiesCaption}>
                                    <h3>
                                      <a href={`/products-details_user?id=${product.id}`}>{product.name}</a>
                                    </h3>
                                    <div className={styles.propertiesFooter}>
                                      <div className={styles.price}>
                                        <span className={styles.currentPrice}>
                                          ₫{Math.round(product.price).toLocaleString()}
                                        </span>
                                        <span className={styles.originalPrice}>
                                          ₫{Math.round(originalPrice).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {totalPages > 1 && renderPagination()}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Products;