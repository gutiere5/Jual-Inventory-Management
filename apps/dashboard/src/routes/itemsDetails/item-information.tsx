import { Category, Item, UnitOfMeasure } from '@repo/types/item.schema';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { uploadFileQueryOptions } from '../../api/query-client';

type Props = {
  isEditing: boolean;
  currentItem: Item;
  setCurrentItem: React.Dispatch<React.SetStateAction<Item>>;
};

const ItemInformation = ({ isEditing, currentItem, setCurrentItem }: Props) => {
  const { mutate } = useMutation(uploadFileQueryOptions());
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `items/${currentItem.name}`;
    mutate({ fileName: fileName, fileContent: file });

    const setEnvVar = `https://assets.jualinbox.com/${fileName}`;
    setCurrentItem({ ...currentItem, image_url: setEnvVar });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Item Information</h2>
        <h3>Basic details and specifications</h3>
      </div>
      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2>Item ID</h2>
            <h3>#{currentItem.id}</h3>
          </div>
          <div>
            <h2>Category</h2>
            {isEditing ? (
              <select
                className="edit-select"
                name="category"
                defaultValue={currentItem.category}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, category: e.target.value as Item['category'] });
                }}
              >
                {Category.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            ) : (
              <span className="badge badge-secondary">{currentItem.category}</span>
            )}
          </div>
          <div>
            <h2>Unit of Measure</h2>
            {isEditing ? (
              <select
                name="uom"
                className="edit-input"
                defaultValue={currentItem.uom}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, uom: e.target.value as Item['uom'] });
                }}
              >
                {UnitOfMeasure.map((uom) => (
                  <option key={uom} value={uom}>
                    {uom}
                  </option>
                ))}
              </select>
            ) : (
              <p className="info-value">{currentItem.uom}</p>
            )}
          </div>
          <div>
            <h2>Low Stock Threshold</h2>
            {isEditing ? (
              <div className="input-with-unit">
                <input
                  name="low_stock_threshold"
                  type="number"
                  className="edit-input"
                  defaultValue={currentItem.low_stock_threshold}
                  onChange={(e) => {
                    setCurrentItem({
                      ...currentItem,
                      low_stock_threshold: Number(e.target.value),
                    });
                  }}
                />
              </div>
            ) : (
              <p className="info-value">{currentItem.low_stock_threshold}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div>
            <h2>Item Image</h2>
            {isEditing ? (
              <input type="file" name="image_url" onChange={handleImageChange} />
            ) : (
              <img
                src={currentItem.image_url}
                alt={currentItem.name}
                style={{ height: '50px', width: '50px' }}
              />
            )}
          </div>
          <div>
            <h2>Current Stock Level</h2>
            <p>
              {' '}
              {currentItem.quantity_remaining} {currentItem.uom}{' '}
            </p>
          </div>
          <div>
            <h2>Active Batches</h2>
            <p>{currentItem.stock_batch.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemInformation;
