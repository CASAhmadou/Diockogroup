import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const IdVerification = () => {
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [idNumber, setIdNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyId } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      // Effacer l'erreur associée
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleIdNumberChange = (e) => {
    setIdNumber(e.target.value);
    if (errors.idNumber) {
      setErrors(prev => ({ ...prev, idNumber: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!idFront) newErrors.idFront = 'Photo recto de la pièce d\'identité requise';
    if (!idBack) newErrors.idBack = 'Photo verso de la pièce d\'identité requise';
    if (!idNumber) newErrors.idNumber = 'Numéro de la pièce d\'identité requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await verifyId({
        idFront,
        idBack,
        idNumber
      });
      navigate('/face-recognition');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Erreur de vérification d\'identité' });
      }
    } finally {
      setIs
    }
}
}

