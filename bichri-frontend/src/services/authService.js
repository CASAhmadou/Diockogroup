import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la connexion');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de l\'inscription');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const getUser = async () => {
  try {
    const response = await api.get('/auth/user');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de récupération des données utilisateur');
  }
};

export const verifyId = async (idData) => {
  try {
    const formData = new FormData();
    formData.append('id_front', idData.idFront);
    formData.append('id_back', idData.idBack);
    formData.append('id_number', idData.idNumber);
    
    const response = await api.post('/auth/verify-id', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la vérification d\'identité');
  }
};

export const verifyFace = async (faceData) => {
  try {
    const formData = new FormData();
    formData.append('face_image', faceData);
    
    const response = await api.post('/auth/verify-face', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de la reconnaissance faciale');
  }
};
