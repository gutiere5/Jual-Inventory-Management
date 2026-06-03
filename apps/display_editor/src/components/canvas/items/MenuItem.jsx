import { Group, Text, Image } from 'react-konva';
import { useItemHandlers } from '../../../hooks/useItemHandlers';
import useImage from 'use-image';
import { useQuery } from '@tanstack/react-query';
import { menuItemQueryOptions } from '../../../api/query-client';
import { useEffect } from 'react';

const MenuItem = ({ item, onChange }) => {
  const { data: updatedItem } = useQuery(menuItemQueryOptions(item.id));
  const { getItemHandlers } = useItemHandlers({
    item,
    onChange,
  });

  useEffect(() => {
    if (!updatedItem) return;
    onChange({ ...item, ...updatedItem });
  }, [updatedItem]);

  const [image] = useImage(item.image_url);

  return (
    <Group id={item.instanceId} {...item} {...getItemHandlers()}>
      {item.showImage && image && <Image image={image} x={0} y={0} {...item.imageStyle} />}
      {item.showTitle && <Text text={item.name || 'MenuItem'} {...item.titleStyle} />}
      {item.showDescription && (
        <Text text={item.description || 'No description'} {...item.descriptionStyle} />
      )}
      {item.showPrice && <Text text={`$${item.price}`} {...item.priceStyle} />}
    </Group>
  );
};

export default MenuItem;
