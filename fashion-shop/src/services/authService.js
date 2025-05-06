import axios from 'axios';

const API_URL = 'http://localhost:8080/identify'; // Thay đổi nếu backend chạy port khác

// const login = async (username, password) => {
//   try {
//     const response = await axios.post(`${API_URL}/auth/token`, {
//       username,
//       password
//     });
    
//     if (response.data.result.token) {
//       // Lưu token vào localStorage hoặc cookie
//       localStorage.setItem('userToken', response.data.result.token);
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error('Login error:', error.response?.data || error.message);
//     throw error;
//   }
// };
  
const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/token`, {
      username,
      password
    });

    if (!response.data.result) {
      throw new Error('Invalid response format');
    }

    const { token, role } = response.data.result;
    
    if (token) {
      localStorage.setItem('userToken', token);
      // Đảm bảo role tồn tại trước khi lưu
      if (role) {
        localStorage.setItem('userRole', role.toUpperCase()); // Chuẩn hóa role thành chữ hoa
      }
    }

    return { ...response.data, role }; // Trả về cả role trong response
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};
  

// const getMyInfo = async () => {
//   const token = localStorage.getItem('userToken');
  
//   try {
//     const response = await axios.get(`${API_URL}/users/myInfo`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Get user info error:', error.response?.data || error.message);
//     throw error;
//   }
// };

export default {
  login
};