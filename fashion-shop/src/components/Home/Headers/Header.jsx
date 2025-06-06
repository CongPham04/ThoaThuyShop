import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser, faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faYoutube, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import styles from "./Header.module.css";
import logo from '../../../assets/img/logo/LogoNew.png';

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                    <li className={styles.textList}><a href="/login">Theo dõi đơn hàng của bạn</a></li>
                  </ul>
                  <ul className={styles.headerSocial}>
                    <li><a href="/login"><FontAwesomeIcon icon={faFacebookF} /></a></li>
                    <li><a href="/login"><FontAwesomeIcon icon={faInstagram} /></a></li>
                    <li><a href="/login"><FontAwesomeIcon icon={faTwitter} /></a></li>
                    <li><a href="/login"><FontAwesomeIcon icon={faLinkedinIn} /></a></li>
                    <li><a href="/login"><FontAwesomeIcon icon={faYoutube} /></a></li>
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
              <a href="/"><img src={logo} alt="Thoa Thuỷ Shop" /></a>
            </div>

            {/* Main Menu */}
            <div className={`${styles.mainMenu} d-none d-lg-block`}>
              <nav>
                <ul className={styles.navigation}>
                  <li><a href="/">Trang Chủ</a></li>
                  <li><a href="/products?collectionId=5">Nam</a></li>
                  <li><a href="/products?collectionId=6">Nữ</a></li>
                  <li><a href="/products?collectionId=7"><span className={styles.newBadge}>Mới</span> Bộ Sưu Tập Trẻ Em</a></li>
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
                <li><a href="/login"><FontAwesomeIcon icon={faUser}/><span>Đăng Nhập</span></a></li>
                <li className={styles.cart}><a href="/cart"><FontAwesomeIcon icon={faShoppingCart} /></a></li>
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
                  <li><a href="/">Trang Chủ</a></li>
                  <li><a href="/products?categoryId=5">Nam</a></li>
                  <li><a href="/products?categoryId=6">Nữ</a></li>
                  <li className={styles.new}><a href="/products?categoryId=7"><span className={styles.newBadge}>Mới</span> Bộ Sưu Tập Trẻ Em</a></li>                  
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
        <p>Giảm giá lên đến 50% Giảm giá lớn nhất. Nhanh tay! Khuyến mãi có hạn<a href="/login" className={styles.browseBtn}>Mua ngay</a></p>
      </div>
    </div>
  );
};

export default Header;