import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nom complet requis';
    
    if (!formData.email) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    
    if (!formData.phone) newErrors.phone = 'Numéro de téléphone requis';
    else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide';
    }
    
    if (!formData.password) newErrors.password = 'Mot de passe requis';
    else if (formData.password.length < 8) newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    
    if (!formData.password_confirmation) newErrors.password_confirmation = 'Confirmation du mot de passe requise';
    else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(formData);
      navigate('/verify-id');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Erreur d\'inscription' });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 className="text-center">Inscription</h2>
        
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Votre email"
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Votre numéro de téléphone"
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Votre mot de passe"
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.password_confirmation && <div className="text-danger">{errors.password_confirmation}</div>}
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block">
              S'inscrire
            </button>
          </div>
        </form>
        
        <div className="text-center mt-3">
          <p>
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;