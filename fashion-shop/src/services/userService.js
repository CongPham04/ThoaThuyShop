import api from './api';

// User Management Service
class UserService {
  // Get current user's information
  async getMyInfo() {
    try {
      const response = await api.get('/users/myInfo');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update current user's information
  async updateMyInfo(userData) {
    try {
      // Get current user info first to get the user ID
      const currentUserResponse = await api.get('/users/myInfo');
      const userId = currentUserResponse.data.data.id;
      
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user by ID (for admin or specific access)
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await api.get('/users/allUsers');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new user (admin only)
  async createUser(userData) {
    try {
      const response = await api.post('/users/addUser', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user by ID (admin or own profile)
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete user by ID (admin only)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      // Get current user info first
      const currentUserResponse = await api.get('/users/myInfo');
      const userId = currentUserResponse.data.data.id;
      
      const response = await api.put(`/users/${userId}`, {
        password: newPassword
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Validate user data
  validateUserData(userData, isUpdate = false) {
    const errors = {};

    if (!isUpdate && (!userData.username || userData.username.length < 3)) {
      errors.username = 'Username must be at least 3 characters long';
    }

    if (!isUpdate && (!userData.password || userData.password.length < 8)) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (userData.password && userData.password.length > 0 && userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!userData.firstname || userData.firstname.trim() === '') {
      errors.firstname = 'First name is required';
    }

    if (!userData.lastname || userData.lastname.trim() === '') {
      errors.lastname = 'Last name is required';
    }

    if (userData.dob) {
      const birthDate = new Date(userData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        errors.dob = 'Please enter a valid birth date';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format user data for display
  formatUserData(userData) {
    return {
      ...userData,
      fullName: `${userData.firstname || ''} ${userData.lastname || ''}`.trim(),
      formattedDob: userData.dob ? new Date(userData.dob).toLocaleDateString('vi-VN') : '',
      rolesDisplay: userData.roles ? userData.roles.join(', ') : '',
      genderDisplay: this.getGenderDisplay(userData.gender)
    };
  }

  // Get gender display text
  getGenderDisplay(gender) {
    const genderMap = {
      'Male': 'Nam',
      'Female': 'Nữ',
      'Other': 'Khác',
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác'
    };
    return genderMap[gender] || gender || 'Không xác định';
  }

  // Handle API errors
  handleError(error) {
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const errorCode = error.response?.data?.code || error.response?.status || 500;
    
    // Translate common error messages to Vietnamese
    const translations = {
      'Username already exists': 'Tên người dùng đã tồn tại',
      'Email already exists': 'Email đã tồn tại',
      'Invalid password': 'Mật khẩu không hợp lệ',
      'User not found': 'Không tìm thấy người dùng',
      'Unauthorized': 'Không có quyền truy cập',
      'Forbidden': 'Bị cấm truy cập',
      'Internal Server Error': 'Lỗi máy chủ nội bộ',
      'Network Error': 'Lỗi kết nối mạng',
      'USER_INVALID': 'Tên người dùng không hợp lệ (tối thiểu 3 ký tự)',
      'INVALID_PASSWORD': 'Mật khẩu không hợp lệ (tối thiểu 8 ký tự)'
    };

    return {
      message: translations[errorMessage] || errorMessage,
      code: errorCode,
      originalError: error
    };
  }

  // Check if user has specific role
  hasRole(userData, role) {
    return userData.roles && userData.roles.includes(role);
  }

  // Check if user is admin
  isAdmin(userData) {
    return this.hasRole(userData, 'ADMIN');
  }

  // Check if user is regular user
  isUser(userData) {
    return this.hasRole(userData, 'USER');
  }
}

// Export singleton instance
const userService = new UserService();
export default userService; 