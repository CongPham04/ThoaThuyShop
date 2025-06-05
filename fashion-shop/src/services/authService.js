import api from './api';

const login = async (username, password) => {
  try {
    // First, get the authentication token
    const authResponse = await api.post('/auth/token', {
      username,
      password,
    });

    if (!authResponse.data.data || !authResponse.data.data.token) {
      throw new Error('Invalid authentication response');
    }

    const { token } = authResponse.data.data;

    // Store the token temporarily to make authenticated requests
    localStorage.setItem('userToken', token);

    try {
      // Fetch user information using the token
      const userResponse = await api.get('/users/myInfo');
      
      if (userResponse.data.code === 1000 && userResponse.data.data) {
        const userData = userResponse.data.data;
        
        // Store both token and user info
        localStorage.setItem('userToken', token);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        
        console.log("User logged in successfully:", userData);
        console.log("User roles:", userData.roles);

        return {
          code: 1000,
          message: "Login successful",
          data: {
            token,
            user: userData
          }
        };
      } else {
        throw new Error('Failed to fetch user information');
      }
    } catch (userError) {
      // If fetching user info fails, clean up the token
      localStorage.removeItem('userToken');
      throw new Error('Failed to load user profile: ' + userError.message);
    }

  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    // Clean up any stored data on login failure
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    throw error;
  }
};

const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);

    if (!response.data.data) {
      throw new Error('Invalid response format');
    }

    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userInfo');
  console.log('User logged out successfully');
};

// Check if user is authenticated and has valid stored info
const isAuthenticated = () => {
  const token = localStorage.getItem('userToken');
  const userInfo = localStorage.getItem('userInfo');
  
  if (!token || !userInfo) {
    return false;
  }

  try {
    const user = JSON.parse(userInfo);
    return !!(user && user.roles && user.roles.length > 0);
  } catch (error) {
    console.error('Error parsing stored user info:', error);
    return false;
  }
};

// Get current user info from localStorage
const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error parsing stored user info:', error);
    return null;
  }
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser
};