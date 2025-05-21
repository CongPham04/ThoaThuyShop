import api from './api';

const login = async (username, password) => {
  try {
    const response = await api.post('/auth/token', {
      username,
      password,
    });

    if (!response.data.data) {
      throw new Error('Invalid response format');
    }

    const { token, user } = response.data.data;

    if (token && user) {
      localStorage.setItem('userToken', token);
      localStorage.setItem('userInfo', JSON.stringify(user));
      // localStorage.setItem('userRole', Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : '');
    } else {
      throw new Error('Missing token or user data');
    }
    console.log("roles", Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : '');

    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
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

export default {
  login,
  register
};