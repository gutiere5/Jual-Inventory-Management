import { useSuspenseQuery } from '@tanstack/react-query';
import { listMenuItemsQueryOptions } from '../../api/query-client';
import { DraggableItem } from './DraggableItem';
import { ASSETS } from '../../constants/assets';

const AssetSection = () => {
  const { data } = useSuspenseQuery(listMenuItemsQueryOptions());

  console.log(data);

  return (
    <>
      <div className="sidebar-section">
        <h2>Menu Item</h2>

        <div>
          <DraggableItem
            key="menu-item-draggable"
            data={{
              type: 'menu',
              name: data[0]?.name,
              price: data[0]?.price,
              image_url: data[0]?.image_url,
              id: data[0]?.id,
            }}
          >
            {data[0]?.image_url && (
              <div className="menu-item-container">
                <img className="menu-item-img" src={data[0].image_url} alt={data[0].name} />
                <div className="menu-item-details">
                  <div className="menu-item-name">{data[0].name}</div>
                  <div className="menu-item-price">{data[0].price}</div>
                </div>
              </div>
            )}
          </DraggableItem>
        </div>
      </div>

      <div className="sidebar-section">
        <h2>Typography</h2>
        <div className="typography-items">
          {ASSETS.typography.map((asset, index) => (
            <DraggableItem key={index} data={asset}>
              <h3 className="typography-item">{asset.text}</h3>
            </DraggableItem>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h2>Shapes</h2>
        <div className="shapes-items">
          {ASSETS.shapes.map((asset, index) => (
            <DraggableItem key={index} data={asset}>
              <div className="shape-item">
                <h3>{asset.label}</h3>
              </div>
            </DraggableItem>
          ))}
        </div>
      </div>
    </>
  );
};

export default AssetSection;
