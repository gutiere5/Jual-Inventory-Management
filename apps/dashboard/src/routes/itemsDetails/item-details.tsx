import './item-details.css';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { AlertTriangle, ArrowLeft, CheckCircle, Download, Edit, Save, X } from 'lucide-react';
// import { Category, UnitOfMeasure, Item } from '@repo/types/item.schema';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { itemQueryOptions, updateItemMutationOptions } from '../../api/query-client';
import ItemInformation from './item-information';
import ItemWasteTracking from './item-waste';
import ItemStockBatches from './item-stock';
import ItemTransactions from './item-transactions';

function ItemDetails() {
  const itemId = useParams().itemId;
  const { data: item } = useSuspenseQuery(itemQueryOptions(Number(itemId)));
  const [currentItem, setCurrentItem] = useState(item);
  const updateMutation = useMutation(updateItemMutationOptions());
  const [isEditing, setIsEditing] = useState(false);

  const isLowStock = item.quantity_remaining < (item.low_stock_threshold ?? 0);

  const handleUpdateItem = () => {
    try {
      updateMutation.mutate(currentItem);
      setIsEditing(false);
      return { success: true, message: 'Item Updated Successfully' };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update item. Please try again.';
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="item-details-container">
      {/* Alert Message */}
      {updateMutation.isError && isEditing && (
        <div className="alert alert-error">
          <AlertTriangle className="icon-small" />
          {updateMutation.error.message}
        </div>
      )}

      {updateMutation.isSuccess && !isEditing && (
        <div className="alert alert-success">
          <CheckCircle className="icon-small" />
          <p>Item updated successfully!</p>
        </div>
      )}

      {/* Header */}
      <div className="item-details-header">
        <div className="header-left">
          <NavLink to="/">
            <button>
              <ArrowLeft />
            </button>
          </NavLink>

          <div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  className="edit-title-input"
                  defaultValue={currentItem.name}
                  required
                  onChange={(e) => {
                    setCurrentItem({ ...currentItem, name: e.target.value });
                  }}
                />
              ) : (
                <h1 style={{ margin: 0 }}>{item.name}</h1>
              )}
              {isLowStock && (
                <span className="badge badge-warning">
                  <AlertTriangle className="icon-small" />
                  Low Stock
                </span>
              )}
            </div>
            <h2 className="header-subtitle">Item Details & Inventory Management</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isEditing ? (
            <>
              <button
                key="save-btn"
                className="action-button save-button"
                disabled={updateMutation.isPending}
                onClick={() => {
                  handleUpdateItem();
                }}
              >
                <Save className="icon-small" />
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </button>

              <button
                key="cancel-btn"
                type="button"
                className="action-button cancel-button"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                <X className="icon-small" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="action-button"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <Edit className="icon-small" />
                Edit
              </button>

              <button className="action-button">
                <Download className="icon-small" />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Item Information Card */}
      <ItemInformation
        isEditing={isEditing}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />

      {/* Stock Batches Card */}
      <ItemStockBatches currentItem={currentItem} />

      {/* Transactions Card */}
      <ItemTransactions currentItem={currentItem} />

      {/* Waste Tracking Card */}
      <ItemWasteTracking currentItem={currentItem} />
    </div>
  );
}

export default ItemDetails;

// 440 lines
