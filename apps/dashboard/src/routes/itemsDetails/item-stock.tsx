import { Item } from '@repo/types/item.schema';
import { Calendar, Clock, Package } from 'lucide-react';

type Props = {
  currentItem: Item;
};

const ItemStockBatches = ({ currentItem }: Props) => {
  const expiringSoon = (expirationDate: string) => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(expirationDate) <= thirtyDaysFromNow;
  };

  function isEmptyStock() {
    return currentItem.stock_batch.length === 0;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Stock Batches</h2>
        <h3 className="card-description">Current inventory batches and expiration dates</h3>
      </div>
      <div className="card-content">
        {isEmptyStock() ? (
          <div className="empty-state">
            <Package />
            <h3>No stock batches available</h3>
          </div>
        ) : (
          <div className="batches-list">
            {currentItem.stock_batch.map((batch, index) => (
              <div
                key={index}
                className={`batch-item ${expiringSoon(batch.expiration_date) ? 'batch-expiring' : ''}`}
              >
                <div className="batch-header">
                  <div className="batch-title-row">
                    <p className="batch-number">Batch #{index + 1}</p>
                    <span className="badge badge-warning-small">
                      <Clock className="icon-tiny" />
                      Expiring Soon
                    </span>
                  </div>
                  <p className="batch-quantity">
                    {batch.quantity_remaining} {currentItem.uom}
                  </p>
                </div>
                <div className="batch-date">
                  <Calendar />
                  <span>Expires: {batch.expiration_date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemStockBatches;

{
  /* {currentItem.stock_batch && currentItem.stock_batch.length > 0 ? (
            {currentItem.stock_batch.map((batch, index) => {
              const expiringSoon = isExpiringSoon(batch.expiration_date);
              return (
                
        ) : (
          <div className="empty-state">
            <Package className="empty-icon" />
            <p>No stock batches available</p>
          </div>
        )}
      </div> */
}
