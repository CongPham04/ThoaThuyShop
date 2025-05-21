import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";
import MainLayout from "../../layouts/Users/MainLayout";
import api from "../../services/api";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({ fullName: "", phoneNumber: "", address: "" });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (state) {
      const processItems = () => {
        let processedItems = [];
        let total = 0;

        if (state.selectedCartItems) {
          // From /cart
          processedItems = state.selectedCartItems.map(item => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            imageUrl: `${api.getUri()}/api/products/${item.productId}/image`
          }));
          total = processedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        } else if (state.product) {
          // From /product-detail_user
          processedItems = [{
            id: state.product.id,
            productId: state.product.id,
            productName: state.product.name,
            price: state.product.price,
            quantity: 1,
            imageUrl: `${api.getUri()}/api/products/${state.product.id}/image`
          }];
          total = state.product.price;
        }

        setItems(processedItems);
        setTotalPrice(total);
      };
      processItems();
    }
  }, [state]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications([{ id, message, type, isExiting: false }, ...notifications]);

    setTimeout(() => handleRemoveNotification(id), 6000);
  };

  const handleRemoveNotification = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isExiting: true } : notif
    ));
    setTimeout(() => setNotifications(notifications.filter(notif => notif.id !== id)), 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address) {
      addNotification("Vui lòng điền đầy đủ thông tin giao hàng.", 'error');
      return;
    }

    if (items.length === 0) {
      addNotification("Không có sản phẩm để thanh toán.", 'error');
      return;
    }

    setLoading(true);
    try {
      const request = {
        fullName: shippingInfo.fullName,
        phoneNumber: shippingInfo.phoneNumber,
        address: shippingInfo.address,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      const response = await api.post("/api/orders", request);
      if (response.data.code === 1000) {
        addNotification("Đơn hàng đã được tạo thành công!");
        setTimeout(() => navigate("/order-confirmation"), 2000); // Redirect after 2 seconds
      } else {
        addNotification(response.data.message || "Tạo đơn hàng thất bại.", 'error');
      }
    } catch (err) {
      addNotification("Lỗi khi tạo đơn hàng. Vui lòng thử lại.", 'error');
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

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
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className={styles.checkoutArea}>
          <div className={styles.container}>
            <h1 className={styles.checkoutTitle}>Thanh Toán</h1>
            <div className={styles.checkoutOverview}>
              <div className={styles.productList}>
                {items.map((item) => (
                  <div key={item.id} className={styles.productItem}>
                    <div className={styles.productImage}>
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <h2 className={styles.productName}>{item.productName}</h2>
                      <div className={styles.quantity}>Số lượng: {item.quantity}</div>
                      <div className={styles.priceSection}>
                        <span className={styles.currentPrice}>
                          ₫{Math.round(item.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.orderSummary}>
                <h3>Thông Tin Đơn Hàng</h3>
                <div className={styles.summaryItem}>
                  <span>Tổng tiền hàng:</span>
                  <span className={styles.summaryValue}>
                    ₫{Math.round(totalPrice).toLocaleString()}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Phương thức vận chuyển:</span>
                  <span className={styles.summaryValue}>Giao Hàng Tiết Kiệm</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Tổng thanh toán:</span>
                  <span className={styles.summaryValue}>
                    ₫{Math.round(totalPrice).toLocaleString()}
                  </span>
                </div>
                <button
                  className={styles.payButton}
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Đang Xử Lý..." : "Thanh Toán"}
                </button>
              </div>
            </div>
            <div className={styles.shippingInfo}>
              <h3>Thông Tin Giao Hàng</h3>
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Số điện thoại"
                value={shippingInfo.phoneNumber}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Checkout;