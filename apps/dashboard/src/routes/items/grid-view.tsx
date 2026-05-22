import { Item } from '@repo/types/item.schema';
import { NavLink } from 'react-router-dom';

const GridView = ({ filteredItems }: { filteredItems: Item[] }) => {
  return (
    <>
      {filteredItems.map((item) => (
        <NavLink to={`/items/${String(item.id)}`} key={item.id}>
          <button className="grid-button" key={item.id}>
            <img src={item.image_url} alt={item.name} className="grid-item-image" />
            <div className="inventory-item-details">
              <h3>{item.name}</h3>
              <div className="inventory-item-quantity">
                <h3>Qty:</h3>
                <h3>{item.quantity_remaining}</h3>
              </div>
              <div className="inventory-item-badges">
                {/* <span className={`badge ${stockStatus.variant}`}>{stockStatus.label}</span> */}
              </div>
            </div>
          </button>
        </NavLink>
      ))}
    </>
  );
};

export default GridView;
