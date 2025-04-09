import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('userToken');
  const role = localStorage.getItem('userRole')?.toUpperCase();

  console.log('PrivateRoute check - Token:', !!token, 'Role:', role, 'Allowed:', allowedRoles); // Debug

  if (!token) {
    console.log('No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.map(r => r.toUpperCase()).includes(role)) {
    console.log('Role not allowed, current role:', role);
    
    // Đặc biệt xử lý cho ADMIN truy cập route không đúng
    if (role === 'ADMIN') {
      console.log('Admin accessing wrong route, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
    
    return <Navigate to="/home_page" replace />;
  }

  console.log('Access granted for role:', role);
  return children;
};

export default PrivateRoute;