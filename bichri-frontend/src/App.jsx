import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Login from './components/pages/Logina';
import Register from './components/Auth/Register';
import IdVerification from './components/Auth/IdVerification';
import FaceRecognition from './components/Auth/FaceRecognition';
import Dashboard from './components/Dashboard/Dashboard';
import TopUp from './components/Transfers/TopUp';
import Transfer from './components/Transfers/Transfer';
import NotFound from './components/UI/NotFound';

function App() {
  const {isAuthenticated, user, isLoading, checkAuthStatus} = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if(isLoading){
    return <div className='loading-container'>Chargement...</div>
  }

  return (
    <div className='app'>
      <Header />
      <main className='main-content'>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" /> } />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" /> } />
          <Route path="/verify-id" element={!isAuthenticated && !user.isIdVerified ? <IdVerification /> : <Navigate to="/dashboard" /> } />
          <Route path="/face-recognition" element={!isAuthenticated && user.isIdVerified && !user.isFaceVerified  ? <FaceRecognition /> : <Navigate to="/dashboard" /> } />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" /> } />
          <Route path="/topup" element={isAuthenticated && user.isIdVerified && user.isFaceVerified ? <Topup /> : <Navigate to="/dashboard" /> } />
          <Route path="/transfer" element={isAuthenticated && user.isIdVerified && user.isFaceVerified ? <Transfer /> : <Navigate to="/dashboard" /> } />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} /> } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
