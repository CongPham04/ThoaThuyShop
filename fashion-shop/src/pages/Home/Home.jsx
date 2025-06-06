import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import styles from "./Home.module.css";
import MainLayout from "../../layouts/Home/MainLayout";
import axios from "axios";

// Import hình ảnh
import sliderBg1 from "../../assets/img/banner/BannerGirl.webp";
import sliderBg2 from "../../assets/img/banner/BannerBoy.png.webp";
import items1 from "../../assets/img/logo/placeholder.jpg";

const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Accept": "application/json" },
});

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("next");
  const [menProductId, setMenProductId] = useState(null);
  const [womenProductId, setWomenProductId] = useState(null);
  const [babyProductId, setBabyProductId] = useState(null);
  const [loading, setLoading] = useState(true);
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
      try {
        setLoading(true);
        const promises = [5, 6, 7].map((id) => publicApi.get(`/api/products/random/${id}`));
        const responses = await Promise.all(promises);
        responses.forEach(({ data }, index) => {
          if (index === 0) setMenProductId(data.data?.id);    // Collection ID 5
          if (index === 1) setWomenProductId(data.data?.id);  // Collection ID 6
          if (index === 2) setBabyProductId(data.data?.id);   // Collection ID 7
        });
      } catch (error) {
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

  const getProductImage = (id) => (id ? `${process.env.REACT_APP_API_URL}/api/products/${id}/image` : items1);

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
                    <img src={getProductImage(menProductId)} alt="Men's Fashion" className="img-fluid" onError={(e) => (e.target.src = "path/to/placeholder.jpg")} />
                  </div>
                  <div className={styles.itemsDetails}>
                    <h4><a href="pro-details.html">Thời Trang Nam</a></h4>
                    <a href="/login" className={styles.browseBtn}>Mua Ngay</a>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                <div className={styles.singleItem}>
                  <div className={styles.itemsImg}>
                    <img src={getProductImage(womenProductId)} alt="Women's Fashion" className="img-fluid" onError={(e) => (e.target.src = "path/to/placeholder.jpg")} />
                  </div>
                  <div className={styles.itemsDetails}>
                    <h4><a href="pro-details.html">Thời Trang Nữ</a></h4>
                    <a href="/login" className={styles.browseBtn}>Mua Ngay</a>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                <div className={styles.singleItem}>
                  <div className={styles.itemsImg}>
                    <img src={getProductImage(babyProductId)} alt="Baby Fashion" className="img-fluid" onError={(e) => (e.target.src = "path/to/placeholder.jpg")} />
                  </div>
                  <div className={styles.itemsDetails}>
                    <h4><a href="pro-details.html">Thời Trang Trẻ Em</a></h4>
                    <a href="/login" className={styles.browseBtn}>Mua Ngay</a>
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
// import React, {useState, useEffect, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faShoppingCart,
//   faHeart,
//   faSearch,
//   faAngleLeft,
//   faAngleRight,
// } from "@fortawesome/free-solid-svg-icons";
// import styles from "./Home.module.css";
// import MainLayout from '../../layouts/Users/MainLayout';
// // // Import hình ảnh
// import sliderBg1 from "../../assets/img/banner/BannerGirl.webp";
// import sliderBg2 from "../../assets/img/banner/BannerBoy.png.webp";
// import items1 from "../../assets/img/items/BoyFashion.jpg.webp";
// import items2 from "../../assets/img/items/girlRed.jpg.webp";
// import items3 from "../../assets/img/items/BaByFashion.webp";
// // import latest1 from "../../assets/itemslogo/latest.JPG";
// // import latest2 from "../../assets/img/logo/latest.JPG";
// // import latest3 from "../../assets/img/logo/latest.JPG";
// // import latest4 from "../../assets/img/logo/latest.JPG";
// // import latest5 from "../../assets/img/logo/latest.JPG";
// // import latest6 from "../../assets/img/logo/latest.JPG";
// // import latest7 from "../../assets/img/logo/latest.JPG";
// // import latest8 from "../../assets/img/logo/latest.JPG";

// const Home = () => {
//    // Thêm state để kiểm soát auto slide
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [transitionDirection, setTransitionDirection] = useState('next');
//   const intervalRef = useRef(null);

//   const slides = [
//     {
//       bg: sliderBg1,
//       content: {
//         title: "Phong cách tối giản của Genz",
//         description: "Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos facilis neque nulla earum.",
//       }
//     },
//     {
//       bg: sliderBg2,
//       content: {
//         title: "Phong cách tối giản của Genz",
//         description: "Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos facilis neque nulla earum.",
//       }
//     }
//   ];

//   // Tự động chuyển slide
//   useEffect(() => {
//     intervalRef.current = setInterval(() => {
//       setTransitionDirection('next');
//       setActiveIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
//     }, 6000);
    
//     return () => clearInterval(intervalRef.current);
//   }, [slides.length]);

//   const handlePrev = () => {
//     setTransitionDirection('prev');
//     setActiveIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
//     resetAutoSlide();
//   };

//   const handleNext = () => {
//     setTransitionDirection('next');
//     setActiveIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
//     resetAutoSlide();
//   };

//   const resetAutoSlide = () => {
//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       setTransitionDirection('next');
//       setActiveIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
//     }, 10000);
//   };
//   return (
    
//     <MainLayout>   
//       <>  
//       <main className={styles.main}>
//         {/* Slider Area Start */}
//         <section className={styles.sliderArea}>
//         <div className={`${styles.carousel}`}>
//           <div className={styles.carouselInner}>
//             {slides.map((slide, index) => {
//               let className = `${styles.sliderItem}`;
              
//               if (index === activeIndex) {
//                 className += ` ${styles.active}`;
//               } else if (
//                 (index === activeIndex + 1) || 
//                 (activeIndex === slides.length - 1 && index === 0)
//               ) {
//                 className += transitionDirection === 'next' ? ` ${styles.next}` : '';
//               } else {
//                 className += transitionDirection === 'prev' ? ` ${styles.prev}` : '';
//               }

//               return (
//                 <div key={index} className={className}>
//                   <div 
//                     className={styles.singleSlider}
//                     style={{ backgroundImage: `url(${slide.bg})` }}
//                   >
//                     <div className="container">
//                     <div className={`row ${slide.content.position === 'right' ? 'justify-content-end' : ''}`}>
//                         <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-8 col-sm-10">
//                           <div className={`${styles.heroCaption} ${styles[`captionStyle${index}`]}`}>
//                             <span>Khuyến mại thời trang</span>
//                             <h1>{slide.content.title}</h1>
//                             <p>{slide.content.description}</p>
//                             <a href="/login" className={styles.heroBtn}>
//                               MUA NGAY
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
          
//           <div className={styles.carouselNavigation}>
//             <button 
//               className={styles.navButton} 
//               onClick={handlePrev}
//               aria-label="Previous slide"
//             >
//               <FontAwesomeIcon icon={faAngleLeft} />
//             </button>
//             <button 
//               className={styles.navButton} 
//               onClick={handleNext}
//               aria-label="Next slide"
//             >
//               <FontAwesomeIcon icon={faAngleRight} />
//             </button>
//           </div>
//         </div>
//       </section>
//         {/* Slider Area End */}

//         {/* Items Product Start */}
//         <section className={styles.itemsProduct}>
//           <div className="container">
//             <div className="row">
//               <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
//                 <div className={styles.singleItem}>
//                   <div className={styles.itemsImg}>
//                     <img src={items1} alt="Men's Fashion" className="img-fluid" />
//                   </div>
//                   <div className={styles.itemsDetails}>
//                     <h4>
//                       <a href="pro-details.html">Thời Trang Nam</a>
//                     </h4>
//                     <a href="/login" className={styles.browseBtn}>
//                       Mua Ngay
//                     </a>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
//                 <div className={styles.singleItem}>
//                   <div className={styles.itemsImg}>
//                     <img
//                       src={items2}
//                       alt="Women's Fashion"
//                       className="img-fluid"
//                     />
//                   </div>
//                   <div className={styles.itemsDetails}>
//                     <h4>
//                       <a href="pro-details.html">Thời Trang Nữ</a>
//                     </h4>
//                     <a href="/login" className={styles.browseBtn}>
//                       Mua Ngay
//                     </a>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
//                 <div className={styles.singleItem}>
//                   <div className={styles.itemsImg}>
//                     <img
//                       src={items3}
//                       alt="Baby Fashion"
//                       className="img-fluid"
//                     />
//                   </div>
//                   <div className={styles.itemsDetails}>
//                     <h4>
//                       <a href="pro-details.html">Thời Trang Trẻ Em</a>
//                     </h4>
//                     <a href="/login" className={styles.browseBtn}>
//                       Mua Ngay
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section> 
//       </main>
//     </>
//   </MainLayout>
//   );
// };

// export default Home;
