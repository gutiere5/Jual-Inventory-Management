import { Item } from '@repo/types/item.schema';
import { Calendar, XCircle } from 'lucide-react';

type Props = {
  currentItem: Item;
};

const ItemWasteTracking = ({ currentItem }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <XCircle className="icon-medium" />
          Waste Records
        </h3>
        <p className="card-description">Track damaged, expired, or discarded inventory</p>
      </div>
      <div className="card-content">
        {currentItem.waste.length > 0 ? (
          <div className="transactions-list">
            {currentItem.waste.map((waste, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-left">
                  <div className="transaction-icon icon-outbound">
                    <XCircle className="icon-small" />
                  </div>
                  <div className="transaction-details">
                    <p className="transaction-type">{waste.reason}</p>
                    <div className="transaction-date">
                      <Calendar className="icon-tiny" />
                      <span>{formatDate(waste.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="transaction-right">
                  <p className="transaction-amount amount-outbound">
                    -{waste.quantity} {currentItem.uom}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <XCircle className="empty-icon" />
            <p>No waste records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemWasteTracking;
