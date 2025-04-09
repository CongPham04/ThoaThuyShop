import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faHeart, faShirt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';
import logo from '../../assets/img/logo/LogoNew2.jpg';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerArea}>
          {/* Subscribe Section */}
          <section className={styles.subscribeArea}>
            <div className="container">
              <div className={`row ${styles.subscribePadding}`}>
                <div className="col-xxl-3 col-xl-3 col-lg-4">
                  <div className={styles.subscribeCaption}>
                    <h3>Đăng ký nhận bản tin</h3>
                    <p>Đăng ký nhận bản tin để được giảm giá 5% cho tất cả sản phẩm.</p>
                  </div>
                </div>
                <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-9">
                  <div className={styles.subscribeCaption}>
                    <form action="#">
                      <input type="text" placeholder="Nhập email của bạn" />
                      <button className={styles.subscribeBtn}>Đăng ký</button>
                    </form>
                  </div>
                </div>
                <div className="col-xxl-2 col-xl-2 col-lg-4">
                  <div className={styles.footerSocial}>
                    <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                    <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Footer Content */}
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-8">
                <div className={styles.singleFooterCaption}>
                  <div className={styles.footerLogo}>
                    <a href="/"><img src={logo} alt="Capital Shop" /></a>
                  </div>
                </div>
              </div>
              
              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                <div className={styles.singleFooterCaption}>
                  <div className={styles.footerTittle}>
                    <h4>Cửa hàng Đàn ông</h4>
                    <ul>
                      <li><a href="#">Thời trang quần áo</a></li>
                      <li><a href="#">Mùa đông</a></li>
                      <li><a href="#">Mùa hè</a></li>
                      <li><a href="#">Chính thức</a></li>
                      <li><a href="#">Bình thường</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                <div className={styles.singleFooterCaption}>
                  <div className={styles.footerTittle}>
                    <h4>Cửa hàng Phụ nữ</h4>
                    <ul>
                      <li><a href="#">Thời trang quần áo</a></li>
                      <li><a href="#">Mùa đông</a></li>
                      <li><a href="#">Mùa hè</a></li>
                      <li><a href="#">Chính thức</a></li>
                      <li><a href="#">Bình thường</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                <div className={styles.singleFooterCaption}>
                  <div className={styles.footerTittle}>
                    <h4>Bộ sưu tập đồ cho bé</h4>
                    <ul>
                      <li><a href="#">Thời trang quần áo</a></li>
                      <li><a href="#">Mùa đông</a></li>
                      <li><a href="#">Mùa hè</a></li>
                      <li><a href="#">Chính thức</a></li>
                      <li><a href="#">Bình thường</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                <div className={styles.singleFooterCaption}>
                  <div className={styles.footerTittle}>
                    <h4>Liên kết nhanh</h4>
                    <ul>
                      <li><a href="#">Theo dõi đơn hàng của bạn</a></li>
                      <li><a href="#">Ủng hộ</a></li>
                      <li><a href="#">Câu hỏi thường gặp</a></li>
                      <li><a href="#">Người vận chuyển</a></li>
                      <li><a href="#">Giới thiệu về chúng tôi</a></li>
                      <li><a href="#">Liên hệ với chúng tôi</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottomArea}>
          <div className="container">
            <div className={styles.footerBorder}>
              <div className="row">
                <div className="col-xl-12">
                  <div className={styles.footerCopyRight}>
                    <p>Copyright ©{new Date().getFullYear()} - Bản quyền Thoa Thuỷ Shop <FontAwesomeIcon icon={faShirt} className={styles.heartIcon} /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;