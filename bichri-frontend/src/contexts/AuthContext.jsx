import React, { createContext, useCallback, useState } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try{
            const token = localStorage.getItem('token');
            if(token){
                const userData = await getUser();
                setUser(userData);
                setIsAuthenticated(true);
            }
        }catch(err){
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogin = async (credentials) => {
        setIsLoading(true);
        setError(null);
        try{
            const {user: userData, token} = await handleLogin(credentials);
            localStorage.setItem('token', token);
            setUser(userData);
            setIsAuthenticated(true);
            return userData;
        }catch(err){
            setError(err.message || 'Erreur de connexion');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    const handleRegister = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
          const { user: newUser, token } = await register(userData);
          localStorage.setItem('token', token);
          setUser(newUser);
          setIsAuthenticated(true);
          return newUser;
        } catch (err) {
          setError(err.message || 'Erreur d\'inscription');
          throw err;
        } finally {
          setIsLoading(false);
        }      
    }

    const handleLogout = async () => {
      setIsLoading(true);
      try {
        await logout();
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } catch (err) {
        console.error('Logout failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    const handleIdVerification = async (idData) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedUser = await verifyId(idData);
        setUser(updatedUser);
        return updatedUser;
      } catch (err) {
        setError(err.message || 'Erreur de vérification d\'identité');
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
    
    const handleFaceVerification = async (faceData) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedUser = await verifyFace(faceData);
        setUser(updatedUser);
        return updatedUser;
      } catch (err) {
        setError(err.message || 'Erreur de reconnaissance faciale');
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
    
    const updateUserData = (userData) => {
        setUser(prevUser => ({ ...prevUser, ...userData }));
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        verifyId: handleIdVerification,
        verifyFace: handleFaceVerification,
        checkAuthStatus,
        updateUserData
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}