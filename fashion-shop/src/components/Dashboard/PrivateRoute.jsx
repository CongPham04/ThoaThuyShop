import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('userToken');
  const userInfo = localStorage.getItem('userInfo');
  let roles = [];

  console.log('🔍 PrivateRoute Debug:');
  console.log('  - Token exists:', !!token);
  console.log('  - UserInfo exists:', !!userInfo);
  console.log('  - UserInfo content:', userInfo);

  try {
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      roles = parsedUserInfo.roles || [];
      console.log('  - Parsed user info:', parsedUserInfo);
      console.log('  - Extracted roles:', roles);
    }
  } catch (error) {
    console.error('❌ Error parsing userInfo:', error);
  }

  // Chuẩn hóa roles thành mảng chuỗi in hoa
  const normalizedRoles = roles.map(role => role.toUpperCase());
  const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

  console.log('🔐 PrivateRoute check:');
  console.log('  - Token:', !!token);
  console.log('  - Current roles:', normalizedRoles);
  console.log('  - Required roles:', normalizedAllowedRoles);
  console.log('  - Has required role:', normalizedRoles.some(role => normalizedAllowedRoles.includes(role)));

  // Nếu không có token, chuyển hướng đến login
  if (!token) {
    console.log('❌ No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Nếu không có roles hoặc không có vai trò nào khớp với allowedRoles
  if (!normalizedRoles.length || !normalizedRoles.some(role => normalizedAllowedRoles.includes(role))) {
    console.log('❌ Roles not allowed, current roles:', normalizedRoles);

    // Đặc biệt xử lý cho ADMIN truy cập route không đúng
    if (normalizedRoles.includes('ADMIN')) {
      console.log('🔄 Admin accessing wrong route, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }

    console.log('🔄 Redirecting to home_page');
    return <Navigate to="/home_page" replace />;
  }

  console.log('✅ Access granted for roles:', normalizedRoles);
  return children;
};

export default PrivateRoute;