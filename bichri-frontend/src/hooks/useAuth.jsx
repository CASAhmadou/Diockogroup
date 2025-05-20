import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useIonToast } from '@ionic/react';

// Création du contexte d'authentification
const AuthContext = createContext(null);

// URL de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Provider d'authentification à placer dans votre composant App.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  // Vérification du token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Configuration des en-têtes avec le token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Récupération des informations utilisateur
          const response = await axios.get(`${API_BASE_URL}/user`);
          setUser(response.data);
        } catch (error) {
          console.error('Error checking authentication:', error);
          // Si le token est invalide, on le supprime
          localStorage.removeItem('auth_token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      
      if (response.data.token) {
        // Stockage du token
        localStorage.setItem('auth_token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Récupération des informations utilisateur
        const userResponse = await axios.get(`${API_BASE_URL}/user`);
        setUser(userResponse.data);
        
        present({
          message: 'Connexion réussie!',
          duration: 2000,
          color: 'success'
        });
        
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Erreur de connexion';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      present({
        message: errorMessage,
        duration: 3000,
        color: 'danger'
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      
      if (response.data.token) {
        // Stockage du token
        localStorage.setItem('auth_token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Mise à jour de l'utilisateur
        setUser(response.data.user);
        
        present({
          message: 'Inscription réussie!',
          duration: 2000,
          color: 'success'
        });
        
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Erreur lors de l\'inscription';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      present({
        message: errorMessage,
        duration: 3000,
        color: 'danger'
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de vérification d'identité
  const verifyIdentity = async (idDocument, faceImage) => {
    setLoading(true);
    try {
      // Création d'un FormData pour envoyer les fichiers
      const formData = new FormData();
      formData.append('id_document', idDocument);
      formData.append('face_image', faceImage);
      
      const response = await axios.post(`${API_BASE_URL}/verify-identity`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      present({
        message: response.data.message || 'Vérification effectuée',
        duration: 2000,
        color: 'success'
      });
      
      // Mise à jour du statut de vérification de l'utilisateur si nécessaire
      if (response.data.user) {
        setUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Identity verification error:', error);
      
      let errorMessage = 'Erreur lors de la vérification d\'identité';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      present({
        message: errorMessage,
        duration: 3000,
        color: 'danger'
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Appel à l'API pour la déconnexion (si nécessaire)
      await axios.post(`${API_BASE_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Suppression du token et réinitialisation de l'utilisateur
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      
      present({
        message: 'Déconnexion réussie',
        duration: 2000,
        color: 'success'
      });
    }
  };

  // Valeurs exposées par le contexte
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifyIdentity,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export default useAuth;