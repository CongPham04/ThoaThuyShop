import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import styles from "./Home.module.css";
import MainLayout from "../../layouts/Users/MainLayout";
import api from "../../services/api";

// Import hình ảnh
import sliderBg1 from "../../assets/img/banner/BannerGirl.webp";
import sliderBg2 from "../../assets/img/banner/BannerBoy.png.webp";
import placeholderImg from "../../assets/img/logo/placeholder.jpg"; 

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("next");
  const [menProductId, setMenProductId] = useState(null);
  const [womenProductId, setWomenProductId] = useState(null);
  const [babyProductId, setBabyProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const slides = [
    { bg: sliderBg1, content: { title: "Phong cách tối giản của Genz", description: "Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos facilis neque nulla earum." } },
    { bg: sliderBg2, content: { title: "Phong cách tối giản của Genz", description: "Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos facilis neque nulla earum." } },
  ];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTransitionDirection("next");
      setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);

    const fetchProducts = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError("Vui lòng đăng nhập để xem sản phẩm.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const promises = [5, 6, 7].map((id) => api.get(`/api/products/random/${id}`));
        const responses = await Promise.all(promises);
        responses.forEach(({ data }, index) => {
          if (index === 0) setMenProductId(data.data?.id);    // Collection ID 5
          if (index === 1) setWomenProductId(data.data?.id);  // Collection ID 6
          if (index === 2) setBabyProductId(data.data?.id);   // Collection ID 7
        });
      } catch (error) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại hoặc đăng nhập.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    return () => clearInterval(intervalRef.current);
  }, []);

  const handlePrev = () => {
    setTransitionDirection("prev");
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    resetAutoSlide();
  };

  const handleNext = () => {
    setTransitionDirection("next");
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    resetAutoSlide();
  };

  const resetAutoSlide = () => clearInterval(intervalRef.current) || (intervalRef.current = setInterval(() => handleNext(), 10000));

  const getProductImage = (id) => (id ? `${api.getUri()}/api/products/${id}/image` : placeholderImg);

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

  if (error) {
    return (
      <MainLayout>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <a href="/login" className={styles.loginLink}>Đăng nhập ngay</a>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className={styles.main}>
        {/* Slider Area Start */}
        <section className={styles.sliderArea}>
          <div className={styles.carousel}>
            <div className={styles.carouselInner}>
              {slides.map((slide, index) => {
                const className = `${styles.sliderItem} ${
                  index === activeIndex ? styles.active :
                  (index === (activeIndex + 1) % slides.length || (activeIndex === 0 && index === slides.length - 1)) && transitionDirection === "next" ? styles.next :
                  styles.prev
                }`;
                return (
                  <div key={index} className={className}>
                    <div className={styles.singleSlider} style={{ backgroundImage: `url(${slide.bg})` }}>
                      <div className="container">
                        <div className="row">
                          <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-8 col-sm-10">
                            <div className={`${styles.heroCaption} ${styles[`captionStyle${index}`]}`}>
                              <span>Khuyến mại thời trang</span>
                              <h1>{slide.content.title}</h1>
                              <p>{slide.content.description}</p>
                              <a href="/login" className={styles.heroBtn}>MUA NGAY</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.carouselNavigation}>
              <button className={styles.navButton} onClick={handlePrev} aria-label="Previous slide">
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              <button className={styles.navButton} onClick={handleNext} aria-label="Next slide">
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          </div>
        </section>
        {/* Items Product Start */}
        <section className={styles.itemsProduct}>
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                <div className={styles.singleItem}>
                  <div className={styles.itemsImg}>
                    <img src={getProductImage(menProductId)} alt="Men's Fashion" className="img-fluid" />
                  </div>
                  <div className={styles.itemsDetails}>
                    <h4><a href={`/products-details_user?id=${menProductId || ''}`}>Thời Trang Nam</a></h4>
                    <a href={`/products-details_user?id=${menProductId || ''}`} className={styles.browseBtn}>Mua Ngay</a>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                <div className={styles.singleItem}>
                  <div className={styles.itemsImg}>
                    <img src={getProductImage(womenProductId)} alt="Women's Fashion" className="img-fluid" />
                  </div>
                  <div className={styles.itemsDetails}>
                    <h4><a href={`/products-details_user?id=${womenProductId || ''}`}>Thời Trang Nữ</a></h4>
                    <a href={`/products-details_user?id=${womenProductId || ''}`} className={styles.browseBtn}>Mua Ngay</a>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                <div className={styles.singleItem}>
                  <div className={styles.itemsImg}>
                    <img src={getProductImage(babyProductId)} alt="Baby Fashion" className="img-fluid" />
                  </div>
                  <div className={styles.itemsDetails}>
                    <h4><a href={`/products-details_user?id=${babyProductId || ''}`}>Thời Trang Trẻ Em</a></h4>
                    <a href={`/products-details_user?id=${babyProductId || ''}`} className={styles.browseBtn}>Mua Ngay</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default Home;