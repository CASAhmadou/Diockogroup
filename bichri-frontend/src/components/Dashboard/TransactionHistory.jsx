import React from 'react';

const TransactionHistory = ({ transactions }) => {
  // Formater le montant avec la devise et séparateur de milliers
  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Déterminer la classe CSS en fonction du type de transaction
  const getTransactionClass = (type) => {
    switch (type) {
      case 'top_up':
        return 'transaction-credit';
      case 'transfer_out':
        return 'transaction-debit';
      case 'transfer_in':
        return 'transaction-credit';
      default:
        return '';
    }
  };

  // Obtenir le symbole (+/-) en fonction du type de transaction
  const getAmountPrefix = (type) => {
    return type === 'top_up' || type === 'transfer_in' ? '+' : '-';
  };

  // Traduire le type de transaction en français
  const translateTransactionType = (type) => {
    switch (type) {
      case 'top_up':
        return 'Recharge';
      case 'transfer_out':
        return 'Transfert sortant';
      case 'transfer_in':
        return 'Transfert entrant';
      default:
        return type;
    }
  };

  return (
    <div className="transaction-history">
      {transactions.length === 0 ? (
        <div className="no-transactions">
          <p>Aucune transaction récente</p>
        </div>
      ) : (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <div className="transaction-icon">
                {transaction.type === 'top_up' && <i className="fas fa-plus-circle"></i>}
                {transaction.type === 'transfer_out' && <i className="fas fa-paper-plane"></i>}
                {transaction.type === 'transfer_in' && <i className="fas fa-donate"></i>}
              </div>
              <div className="transaction-info">
                <div className="transaction-title">
                  {translateTransactionType(transaction.type)}
                </div>
                <div className="transaction-date">
                  {formatDate(transaction.createdAt)}
                </div>
              </div>
              <div className={`transaction-amount ${getTransactionClass(transaction.type)}`}>
                {getAmountPrefix(transaction.type)}{formatAmount(transaction.amount, transaction.currency)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;
