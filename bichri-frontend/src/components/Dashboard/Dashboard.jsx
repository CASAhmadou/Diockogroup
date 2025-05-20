import React, { useState } from 'react';

const VirtualCard = ({ cardData }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const maskCardNumber = (number) => {
    const last4 = number.slice(-4);
    return `**** **** **** ${last4}`;
  };

  return (
    <div className="card virtual-card">
      <div className="card-header">
        <h3>Ma Carte Virtuelle</h3>
      </div>
      <div className="card-body">
        <div className="card-display" onClick={toggleDetails}>
          <div className="card-chip"></div>
          <div className="card-logo">{cardData.type}</div>
          <div className="card-number">
            {showDetails 
              ? formatCardNumber(cardData.cardNumber) 
              : maskCardNumber(cardData.cardNumber)}
          </div>
          <div className="card-info">
            <div className="card-holder">
              <small>TITULAIRE</small>
              <p>{cardData.cardHolder}</p>
            </div>
            <div className="card-expiry">
              <small>EXPIRE</small>
              <p>{cardData.expiryMonth}/{cardData.expiryYear}</p>
            </div>
          </div>
        </div>
        
        <div className="card-actions">
          <button 
            className="btn btn-sm btn-outline-primary" 
            onClick={toggleDetails}
          >
            {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
          </button>
          
          <button className="btn btn-sm btn-outline-secondary">
            Bloquer la carte
          </button>
        </div>
        
        {showDetails && (
          <div className="card-details">
            <div className="detail-item">
              <span>CVV:</span>
              <span>{cardData.cvv}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualCard;
