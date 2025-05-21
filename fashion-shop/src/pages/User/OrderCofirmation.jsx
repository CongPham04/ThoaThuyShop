import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./OrderConfirmation.module.css";
import MainLayout from "../../layouts/Users/MainLayout";
import api from "../../services/api";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [productImages, setProductImages] = useState({}); // Store image URLs

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/orders");
      console.log("API Response:", response.data); // Debug the full response
      if (response.data.code === 1000 && Array.isArray(response.data.data)) {
        const userOrders = response.data.data;
        setOrders(userOrders);
        if (userOrders.length === 0) {
          addNotification("Không có đơn hàng nào để hiển thị.", "info");
        }
      } else {
        addNotification(
          `Không thể tải danh sách đơn hàng: ${response.data.message || "Không có dữ liệu"}`,
          "error"
        );
      }
    } catch (err) {
      addNotification("Lỗi khi tải danh sách đơn hàng. Vui lòng thử lại.", "error");
      console.error("Fetch orders error:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product images for all items in orders
  useEffect(() => {
    const fetchProductImages = async () => {
      if (!orders || orders.length === 0) return;

      // Collect all product IDs from all orders
      const productIds = orders
        .flatMap((order) => order.items || [])
        .map((item) => item?.productId)
        .filter((id) => id !== undefined && id !== null); // Ensure valid IDs
      if (productIds.length === 0) {
        console.warn("No valid product IDs found in orders.");
        return;
      }

      console.log("Fetching images for product IDs:", productIds);

      const imagePromises = productIds.map(async (productId) => {
        try {
          const response = await api.get(`/api/products/${productId}/image`, {
            responseType: "arraybuffer", // Important for binary data
          });
          const contentType = response.headers["content-type"] || "image/jpeg";
          const blob = new Blob([response.data], { type: contentType });
          const imageUrl = URL.createObjectURL(blob);
          console.log(`Successfully fetched image for productId ${productId}`);
          return { productId, imageUrl };
        } catch (err) {
          console.error(`Failed to fetch image for product ${productId}:`, err);
          return { productId, imageUrl: "/images/placeholder.jpg" };
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
  }, [orders]);

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

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        const response = await api.delete(`/api/orders/${orderId}`);
        if (response.data.code === 1000) {
          addNotification("Đơn hàng đã được hủy thành công!");
          await fetchUserOrders();
        } else {
          addNotification(response.data.message || "Hủy đơn hàng thất bại.", "error");
        }
      } catch (err) {
        addNotification("Lỗi khi hủy đơn hàng. Vui lòng thử lại.", "error");
        console.error("Cancel order error:", err.response ? err.response.data : err.message);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <main className={styles.main}>
          <div className={styles.loading}>Đang tải...</div>
        </main>
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
        <div className={styles.container}>
          {orders.length === 0 ? (
            <div className={styles.error}>Không tìm thấy đơn hàng nào.</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={styles.orderWrapper}>
                <div className={styles.orderHeader}>
                    <h4>Thông Tin Đơn Hàng #{order.id}</h4>
                  <p className={styles.status}>
                    <strong>Trạng thái:</strong>{" "}
                    {order.status === "pending" ? "Chưa xác nhận" : "Đã xác nhận"}
                  </p>
                  <p>
                    <strong>Địa chỉ giao hàng:</strong> {order.shippingInfo?.address || "Chưa có"}
                  </p>
                  <p>
                    <strong>Tên người nhận:</strong> {order.shippingInfo?.fullName || "Chưa có"}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {order.shippingInfo?.phoneNumber || "Chưa có"}
                  </p>
                  <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString("vi-VN") || "Chưa có"}
                  </p>
                </div>
                <table className={styles.orderTable}>
                  <thead>
                    <tr>
                      <th>Ảnh Sản Phẩm</th>
                      <th>Tên Sản Phẩm</th>
                      <th>Giá</th>
                      <th>Số Lượng</th>
                      <th>Tổng Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => {
                        const price = Number(item.price) || 0;
                        const quantity = Number(item.quantity) || 0;
                        const total = price * quantity;
                        const imageSrc = productImages[item.productId] || "/images/placeholder.jpg";

                        return (
                          <tr key={item.id}>
                            <td>
                              <img
                                src={imageSrc}
                                alt={item.productName || "Sản phẩm"}
                                className={styles.productImage}
                                onError={(e) => {
                                  console.error(`Image load failed for productId ${item.productId}`);
                                  e.target.src = "/images/placeholder.jpg";
                                }}
                              />
                            </td>
                            <td>{item.productName || "Tên sản phẩm chưa có"}</td>
                            <td>₫{(price || 0).toLocaleString()}</td>
                            <td>{quantity || 0}</td>
                            <td>₫{(total || 0).toLocaleString()}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5">Không có sản phẩm nào trong đơn hàng.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className={styles.orderSummary}>
                  <p>
                    <strong>Tổng tiền phải trả:</strong>{" "}
                    ₫{(order.totalPrice || 0).toLocaleString()}
                  </p>
                  {order.status === "pending" && (
                    <button
                      className={styles.cancelButton}
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Hủy Đơn Hàng
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </MainLayout>
  );
};

export default OrderConfirmation;