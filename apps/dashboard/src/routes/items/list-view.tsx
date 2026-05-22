import { Item } from '@repo/types/item.schema';
import { NavLink } from 'react-router-dom';

const ListView = ({ filteredItems }: { filteredItems: Item[] }) => {
  return (
    <div className="list-view-container">
      {filteredItems.map((item) => (
        <NavLink to={`/items/${String(item.id)}`} key={item.id}>
          <button key={item.id} className="list-card">
            <img src={item.image_url} alt={item.name} className="list-image" />

            <div>
              <h2>{item.name}</h2>
              <h3>{item.category}</h3>
            </div>

            <div>
              <h2>Quantity:</h2>
              <h3>{item.quantity_remaining}</h3>
            </div>

            <div className="inventory-item-status-col">
              {/* <span className={`badge ${stockStatus.variant}`}>{stockStatus.label}</span> */}
            </div>
          </button>
        </NavLink>
      ))}
    </div>
  );
};

export default ListView;
