import api from './api';

export const getBalance = async () => {
  try {
    const response = await api.get('/account/balance');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de récupération du solde');
  }
};

export const getTransactions = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de récupération des transactions');
  }
};

export const topUp = async (data) => {
  try {
    const response = await api.post('/transactions/topup', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de recharge');
  }
};

export const transfer = async (data) => {
  try {
    const response = await api.post('/transactions/transfer', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec du transfert');
  }
};

export const getVirtualCard = async () => {
  try {
    const response = await api.get('/account/virtual-card');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Échec de récupération de la carte virtuelle');
  }
};
