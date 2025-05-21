import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('userToken');
  const userInfo = localStorage.getItem('userInfo');
  let roles = [];

  try {
    if (userInfo) {
      roles = JSON.parse(userInfo).roles || [];
    }
  } catch (error) {
    console.error('Error parsing userInfo:', error);
  }

  // Chuẩn hóa roles thành mảng chuỗi in hoa
  const normalizedRoles = roles.map(role => role.toUpperCase());
  const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

  console.log('PrivateRoute check - Token:', !!token, 'Roles:', normalizedRoles, 'Allowed:', normalizedAllowedRoles);

  // Nếu không có token, chuyển hướng đến login
  if (!token) {
    console.log('No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Nếu không có roles hoặc không có vai trò nào khớp với allowedRoles
  if (!normalizedRoles.length || !normalizedRoles.some(role => normalizedAllowedRoles.includes(role))) {
    console.log('Roles not allowed, current roles:', normalizedRoles);

    // Đặc biệt xử lý cho ADMIN truy cập route không đúng
    if (normalizedRoles.includes('ADMIN')) {
      console.log('Admin accessing wrong route, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/home_page" replace />;
  }

  console.log('Access granted for roles:', normalizedRoles);
  return children;
};

export default PrivateRoute;