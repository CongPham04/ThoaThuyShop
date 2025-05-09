import api from './api';

const login = async (username, password) => {
  try {
    const response = await api.post('/auth/token', {
      username,
      password,
    });

    if (!response.data.result) {
      throw new Error('Invalid response format');
    }

    const { token, role } = response.data.result;

    if (token) {
      localStorage.setItem('userToken', token);
      if (role) {
        localStorage.setItem('userRole', role.toUpperCase());
      }
    }

    return { ...response.data, role };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);

    if (!response.data.result) {
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