import { Group, Text, Image } from 'react-konva';
import type { CanvasItem } from '@repo/types/canvasObject.schema';
import useImage from 'use-image';

type MenuCanvasItem = Extract<CanvasItem, { type: 'menu' }>;

const MenuItem = (item: MenuCanvasItem) => {
  const [image] = useImage(item.image_url);

  return (
    <Group id={item.instanceId} {...item}>
      {item.showImage && image && (
        <Image image={image} x={0} y={0} cornerRadius={[8, 8, 8, 8]} width={100} height={100} />
      )}
      {item.showTitle && (
        <Text text={item.name || 'MenuItem'} x={180} y={10} {...item.titleStyle} />
      )}
      {item.showDescription && (
        <Text
          text={item.description || 'No description'}
          x={180}
          y={40}
          {...item.descriptionStyle}
        />
      )}
      {item.showPrice && <Text text={item.price || '0'} x={180} y={70} {...item.priceStyle} />}
    </Group>
  );
};

export default MenuItem;
