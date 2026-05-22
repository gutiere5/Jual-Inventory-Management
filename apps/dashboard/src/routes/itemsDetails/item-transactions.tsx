import { Item } from '@repo/types/item.schema';
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';

type Props = {
  currentItem: Item;
};
const ItemTransactions = ({ currentItem }: Props) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <TrendingUp className="icon-medium" />
          Recent Transactions
        </h3>
        <p className="card-description">Inventory movement history</p>
      </div>
      <div className="card-content">
        {currentItem.transaction.length > 0 ? (
          <div className="transactions-list">
            {currentItem.transaction.map((t, index) => {
              const isInbound =
                t.type.toLowerCase().includes('in') || t.type.toLowerCase().includes('receive');
              return (
                <div key={index} className="transaction-item">
                  <div className="transaction-left">
                    <div
                      className={`transaction-icon ${isInbound ? 'icon-inbound' : 'icon-outbound'}`}
                    >
                      {isInbound ? (
                        <TrendingUp className="icon-small" />
                      ) : (
                        <TrendingDown className="icon-small" />
                      )}
                    </div>
                    <div className="transaction-details">
                      <p className="transaction-type">{t.type}</p>
                      <div className="transaction-date">
                        <Calendar className="icon-tiny" />
                        <span>{t.transaction_date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="transaction-right">
                    <p
                      className={`transaction-amount ${isInbound ? 'amount-inbound' : 'amount-outbound'}`}
                    >
                      {isInbound ? '+' : '-'}
                      {Math.abs(t.quantity)} {currentItem.uom}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <TrendingUp className="empty-icon" />
            <p>No transactions recorded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemTransactions;
