import React from 'react';

const Balance = ({ balance }) => {
  // Formater le montant avec la devise et séparateur de milliers
  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="card balance-card">
      <div className="card-body">
        <div className="balance-header">
          <h3>Solde disponible</h3>
        </div>
        <div className="balance-amount">
          {formatAmount(balance.amount, balance.currency)}
        </div>
        <div className="balance-info">
          <div className="info-item">
            <span className="info-label">Dernière mise à jour:</span>
            <span className="info-value">
              {new Date(balance.updatedAt).toLocaleString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
