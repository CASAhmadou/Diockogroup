import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { topUp } from '../../services/transactionService';

const TopUp = () => {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'mobile_money',
    phoneNumber: '',
    provider: 'orange_money'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: saisie du montant, 2: saisie de la méthode et infos, 3: confirmation
  const navigate = useNavigate();

  const paymentMethods = [
    { id: 'mobile_money', name: 'Mobile Money' },
    { id: 'bank_transfer', name: 'Virement bancaire' },
    { id: 'credit_card', name: 'Carte de crédit' }
  ];

  const providers = [
    { id: 'orange_money', name: 'Orange Money' },
    { id: 'mtn_momo', name: 'MTN MoMo' },
    { id: 'wave', name: 'Wave' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = 'Le montant est requis';
    else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Veuillez entrer un montant valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.method) newErrors.method = 'La méthode de paiement est requise';
    
    if (formData.method === 'mobile_money') {
      if (!formData.provider) newErrors.provider = 'Le fournisseur est requis';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Le numéro de téléphone est requis';
      else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Format de téléphone invalide';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      await topUp(formData);
      // Rediriger vers le tableau de bord avec un message de succès
      navigate('/dashboard', { 
        state: { 
          success: true, 
          message: `Votre compte a été rechargé de ${formData.amount} ${formData.currency || 'CFA'}` 
        } 
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Erreur// Structure du projet'})
      }
    }
}}