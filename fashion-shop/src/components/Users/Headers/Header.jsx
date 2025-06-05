import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser, faSearch, faBars, faSignOutAlt, faClipboard } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faYoutube, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import styles from "./Header.module.css";
import logo from '../../../assets/img/logo/LogoNew.png';
import userAvatar from '../../../assets/img/profiles/53b90b59-67fe-42e4-bf10-d9e1f10ebc80.png';
import image1 from '../../../assets/img/logo/placeholder.jpg';
import api from '../../../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Full cart items for display
  const [displayCartItems, setDisplayCartItems] = useState([]); // Limited to 5 items for dropdown
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState({}); // Store image URLs
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/cart');
        if (response.data.code === 1000 && response.data.data && response.data.data.items) {
          const fullItems = response.data.data.items; // Full cart items
          setCartItems(fullItems); // Store full list
          setDisplayCartItems(fullItems.slice(0, 5)); // Limit to 5 for dropdown
        } else {
          console.warn("No cart data or invalid response:", response.data.message);
          setCartItems([]);
          setDisplayCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setCartItems([]);
        setDisplayCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // Fetch product images when cart items are loaded
  useEffect(() => {
    const fetchProductImages = async () => {
      if (!displayCartItems || displayCartItems.length === 0) return;

      const imagePromises = displayCartItems.map(async (item) => {
        try {
          const response = await api.get(item.imageUrl, {
            responseType: 'arraybuffer', // Important for binary data
          });
          const contentType = response.headers['content-type'] || 'image/jpeg';
          const blob = new Blob([response.data], { type: contentType });
          const imageUrl = URL.createObjectURL(blob);
          return { productId: item.productId, imageUrl };
        } catch (err) {
          console.error(`Failed to fetch image for product ${item.productId}:`, err);
          return { productId: item.productId, imageUrl: image1 }; // Fallback to placeholder
        }
      });

      const images = await Promise.all(imagePromises);
      const imageMap = images.reduce((acc, { productId, imageUrl }) => {
        acc[productId] = imageUrl;
        return acc;
      }, {});

      setProductImages((prev) => {
        // Revoke previous URLs to avoid memory leaks
        Object.values(prev).forEach((url) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
        return imageMap;
      });
    };

    fetchProductImages();

    // Cleanup on unmount
    return () => {
      Object.values(productImages).forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [displayCartItems]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };
  const handleOrder = () => {
    navigate('/order-confirmation');
    setIsMenuOpen(false);
  };
  // Điều hướng đến trang thông tin tài khoản
  const handleAccountInfo = () => {
    navigate('/user-info');
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleViewCart = () => {
    navigate('/cart');
    setIsCartOpen(false);
  };

  return (
    <div className={styles.headerArea}>
      {/* Top Header */}
      <div className={`${styles.headerTop} d-none d-sm-block`}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className={`d-flex justify-content-between flex-wrap align-items-center ${styles.headerTopContent}`}>
                <div className={styles.headerInfoLeft}>
                  <ul>
                    <li><a href="#">Giới Thiệu Về Chúng Tôi</a></li>
                    <li><a href="#">Sự Riêng Tư</a></li>
                    <li><a href="#">Câu Hỏi Thường Gặp</a></li>
                    <li><a href="#">Nghề Nghiệp</a></li>
                  </ul>
                </div>
                <div className={`${styles.headerInfoRight} d-flex`}>
                  <ul className={styles.orderList}>
                    <li className={styles.textList}><a href="#">Danh sách yêu thích của tôi</a></li>
                    <li className={styles.textList}><a href="#">Theo dõi đơn hàng của bạn</a></li>
                  </ul>
                  <ul className={styles.headerSocial}>
                    <li><a href="https://www.facebook.com/nha.may.thoa.thuy"><FontAwesomeIcon icon={faFacebookF} /></a></li>
                    <li><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
                    <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
                    <li><a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a></li>
                    <li><a href="#"><FontAwesomeIcon icon={faYoutube} /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`${styles.headerMid} ${styles.headerSticky}`}>
        <div className="container">
          <div className={styles.menuWrapper}>
            {/* Logo */}
            <div className={styles.logo}>
              <a href="/home_page"><img src={logo} alt="Thoa Thuỷ Shop" /></a>
            </div>

            {/* Main Menu */}
            <div className={`${styles.mainMenu} d-none d-lg-block`}>
              <nav>
                <ul className={styles.navigation}>
                  <li><a href="/home_page">Trang Chủ</a></li>
                  <li><a href="/products_user?collectionId=5">Nam</a></li>
                  <li><a href="/products_user?collectionId=6">Nữ</a></li>
                  <li><a href="/products_user?collectionId=7"><span className={styles.newBadge}>Mới</span> Bộ Sưu Tập Trẻ Em</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/contact">Liên Hệ</a></li>
                </ul>
              </nav>
            </div>

            {/* Header Right */}
            <div className={styles.headerRight}>
              <ul>
                <li>
                  <div className={`${styles.navSearch} ${styles.searchSwitch} ${styles.headerIcon}`}>
                    <a onClick={() => setShowSearch(!showSearch)}>
                      <FontAwesomeIcon icon={faSearch} />
                    </a>
                  </div>
                </li>
                <li>
                  <div 
                    className={styles.userProfile}
                    onMouseEnter={() => setIsMenuOpen(true)}
                    onMouseLeave={() => setIsMenuOpen(false)}
                  >
                    <img src={userAvatar} alt="User" className={styles.avatar} />
                    <span className={styles.userName}>User</span>
                    {isMenuOpen && (
                      <div className={styles.dropdownMenu}>
                        <button onClick={handleOrder} className={styles.menuItem}>
                          <FontAwesomeIcon icon={faClipboard} className={styles.menuIcon} />
                          Đơn mua
                        </button>
                        <button onClick={handleAccountInfo} className={styles.menuItem}>
                          <FontAwesomeIcon icon={faUser} className={styles.menuIcon} />
                          Thông tin tài khoản
                        </button>
                        <button onClick={handleLogout} className={styles.menuItem}>
                          <FontAwesomeIcon icon={faSignOutAlt} className={styles.menuIcon} />
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                </li>
                <li 
                  className={styles.cart}
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                >
                  <a onClick={handleCartClick}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                    {cartItems.length > 0 && (
                      <span className={styles.cartCount}>{cartItems.length}</span>
                    )}
                  </a>
                  {isCartOpen && !loading && cartItems.length > 0 && (
                    <div className={styles.cartDropdown}>
                      {displayCartItems.map((item) => {
                        const imageSrc = productImages[item.productId] || image1;
                        return (
                          <div key={item.id} className={styles.cartItem}>
                            <img 
                              src={imageSrc}
                              alt={item.productName || item.name}
                              className={styles.cartItemImage}
                              onError={(e) => (e.target.src = image1)}
                            />
                            <div className={styles.cartItemDetails}>
                              <span className={styles.cartItemName}>{item.productName || item.name}</span>
                              <span className={styles.cartItemPrice}>₫{(item.price || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                      <div className={styles.cartFooter}>
                        <button onClick={handleViewCart} className={styles.viewCartButton}>
                          Xem chi tiết giỏ hàng
                        </button>
                        <span className={styles.cartItemCount}>
                          ({cartItems.length} sản phẩm)
                        </span>
                      </div>
                    </div>
                  )}
                  {isCartOpen && loading && (
                    <div className={styles.cartDropdown}>
                      <div className={styles.loading}>Đang tải...</div>
                    </div>
                  )}
                  {isCartOpen && cartItems.length === 0 && (
                    <div className={styles.cartDropdown}>
                      <div className={styles.emptyCart}>Giỏ hàng trống</div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/* Search Box */}
          <div className={`${styles.searchInput} ${showSearch ? styles.show : ''}`}>
            <form className={`${styles.searchInner} d-flex justify-content-between`}>
              <input type="text" className="form-control" placeholder="Tìm kiếm..." />
              <button type="submit" className="btn"></button>
              <span className={styles.closeSearch} onClick={() => setShowSearch(false)}>x</span>
            </form>
          </div>

          {/* Mobile Menu */}
          <div className="col-12">
            <div className={`${styles.mobileMenu} d-block d-lg-none`}>
              <button 
                className={styles.mobileMenuButton}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                MENU <FontAwesomeIcon icon={faBars}/>
              </button>
              {mobileMenuOpen && (
                <ul className={styles.mobileNav}>
                  <li><a href="/home_page">Trang Chủ</a></li>
                  <li><a href="/products_user?collectionId=5">Nam</a></li>
                  <li><a href="/products_user?collectionId=6">Nữ</a></li>
                  <li className={styles.new}><a href="/products_user?collectionId=7"><span className={styles.newBadge}>Mới</span> Bộ Sưu Tập Trẻ Em</a></li>                 
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/contact">Liên Hệ</a></li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Header */}
      <div className={`${styles.headerBottom} text-center`}>
        <p>Giảm giá lên đến 50% Giảm giá lớn nhất. Nhanh tay! Khuyến mãi có hạn<a href="/products-details_user?id=28" className={styles.browseBtn}>Mua ngay</a></p>
      </div>
    </div>
  );
};

export default Header;