import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";
import MainLayout from "../../layouts/Users/MainLayout";
import api from "../../services/api";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [productImages, setProductImages] = useState({}); // Store image URLs
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartId = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/cart');
        if (response.data.code === 1000 && response.data.data) {
          setCartId(response.data.data.id);
        } else {
          setError(response.data.message || "Không thể tải giỏ hàng.");
        }
      } catch (err) {
        setError("Lỗi kết nối máy chủ. Vui lòng thử lại.");
        console.error("Fetch cart error:", err);
      }
    };
    fetchCartId();
  }, []);

  useEffect(() => {
    const fetchCartDetails = async () => {
      if (!cartId) return;
      try {
        setLoading(true);
        const response = await api.get(`api/cart/${cartId}`);
        if (response.data.code === 1000) {
          setCart(response.data.data);
        } else {
          setError(response.data.message || "Không thể tải chi tiết giỏ hàng.");
        }
      } catch (err) {
        setError("Lỗi khi tải chi tiết giỏ hàng. Vui lòng thử lại.");
        console.error("Fetch cart details error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCartDetails();
  }, [cartId]);

  // Fetch product images when cart items are loaded
  useEffect(() => {
    const fetchProductImages = async () => {
      if (!cart || !cart.items) return;

      const imagePromises = cart.items.map(async (item) => {
        try {
          const response = await api.get(`/api/products/${item.productId}/image`, {
            responseType: 'arraybuffer', // Important for binary data
          });

          const contentType = response.headers['content-type'] || 'image/jpeg';
          const blob = new Blob([response.data], { type: contentType });
          const imageUrl = URL.createObjectURL(blob);
          return { productId: item.productId, imageUrl };
        } catch (err) {
          console.error(`Failed to fetch image for product ${item.productId}:`, err);
          return { productId: item.productId, imageUrl: "/images/placeholder.jpg" };
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
  }, [cart]);

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

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSelectAll = () => {
    if (!cart || !cart.items) return;
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map((item) => item.id));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await api.delete(`api/cart/remove/${itemId}`);
      if (response.data.code === 1000) {
        addNotification("Sản phẩm đã được xóa thành công!");
        // Delay reload to show notification
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 2-second delay
      } else {
        addNotification(response.data.message || "Không thể xóa sản phẩm.", 'error');
      }
    } catch (err) {
      addNotification("Lỗi khi xóa sản phẩm. Vui lòng thử lại.", 'error');
      console.error("Remove item error:", err);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const response = await api.put('api/cart/update', { cartItemId: itemId, quantity });
      if (response.data.code === 1000) {
        setCart(response.data.data);
      } else {
        addNotification(response.data.message || "Không thể cập nhật số lượng.", 'error');
      }
    } catch (err) {
      addNotification("Lỗi khi cập nhật số lượng. Vui lòng thử lại.", 'error');
      console.error("Update quantity error:", err);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      addNotification("Vui lòng chọn ít nhất một sản phẩm để xóa.", 'error');
      return;
    }

    try {
      setLoading(true);
      for (const itemId of selectedItems) {
        const response = await api.delete(`api/cart/remove/${itemId}`);
        if (response.data.code !== 1000) {
          throw new Error(response.data.message || "Lỗi khi xóa sản phẩm.");
        }
      }
      addNotification("Các sản phẩm đã được xóa thành công!");
      // Delay reload to show notification
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2-second delay
    } catch (err) {
      addNotification("Lỗi khi xóa các sản phẩm được chọn. Vui lòng thử lại.", 'error');
      console.error("Delete selected items error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    const selectedCartItems = cart.items.filter((item) => selectedItems.includes(item.id));
    navigate('/checkout', { state: { selectedCartItems } });
  };

  const handleShopNow = () => {
    navigate('/products_user?collectionId=6');
  };

  // Calculate selectedTotal, ensuring it's always defined
  const selectedTotal = cart && cart.items
    ? cart.items
        .filter((item) => selectedItems.includes(item.id))
        .reduce((sum, item) => {
          const price = Number(item.price) || 0;
          const quantity = Number(item.quantity) || 0;
          return sum + price * quantity;
        }, 0)
    : 0;

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.loading}>Đang tải...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className={styles.error}>{error}</div>
      </MainLayout>
    );
  }

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
        <div className={styles.cartArea}>
          <div className={styles.container}>
            <h1 className={styles.cartTitle}>Chi Tiết Giỏ Hàng</h1>
            {!cart || !cart.items || cart.items.length === 0 ? (
              <div className={styles.emptyCart}>
                <p>Giỏ hàng trống.</p>
                <div className={styles.cartFooter}>
                  <button onClick={handleShopNow} className={styles.shopNowButton}>
                    Mua ngay
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.cartHeader}>
                  <label className={styles.selectAll}>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cart.items.length && cart.items.length > 0}
                      onChange={handleSelectAll}
                    />
                    Chọn tất cả ({cart.items.length})
                  </label>
                  <span className={styles.headerPrice}>Đơn giá</span>
                  <span className={styles.headerQuantity}>Số lượng</span>
                  <span className={styles.headerTotal}>Thành tiền</span>
                </div>
                <div className={styles.cartItems}>
                  {cart.items.map((item) => {
                    const price = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;
                    const total = price * quantity;
                    const imageSrc = productImages[item.productId] || "/images/placeholder.jpg";

                    return (
                      <div key={item.id} className={styles.cartItem}>
                        <label className={styles.itemCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </label>
                        <img
                          src={imageSrc}
                          alt={item.productName || "Product Image"}
                          className={styles.cartItemImage}
                          onError={(e) => {
                            e.target.src = "/images/placeholder.jpg";
                          }}
                        />
                        <div className={styles.cartItemDetails}>
                          <span className={styles.cartItemName}>{item.productName || "Unknown Product"}</span>
                        </div>
                        <div className={styles.cartItemPrice}>₫{price.toLocaleString()}</div>
                        <div className={styles.quantityContainer}>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span className={styles.quantityValue}>{quantity}</span>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                        <div className={styles.cartItemTotal}>₫{total.toLocaleString()}</div>
                        <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.cartSummary}>
                  <button
                    className={styles.deleteSelectedButton}
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.length === 0}
                  >
                    Xóa các mục đã chọn
                  </button>
                  <div className={styles.summaryDetails}>
                    <span>Tổng thanh toán ({selectedItems.length} sản phẩm):</span>
                    <span className={styles.summaryTotal}>₫{selectedTotal.toLocaleString()}</span>
                  </div>
                  <button
                    className={styles.checkoutButton}
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    Mua Hàng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Cart;