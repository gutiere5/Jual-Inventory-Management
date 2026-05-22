import type { CanvasItem } from '@repo/types/canvasObject.schema';
import MenuItem from './MenuItem';
import { Circle, Line, Rect, Text } from 'react-konva';

const CanvasItemRenderer = ({ item }: { item: CanvasItem }) => {
  switch (item.type) {
    case 'rect':
      return <Rect {...item} />;
    case 'line':
      return <Line {...item} />;
    case 'circle':
      return <Circle {...item} />;
    case 'text':
      return <Text {...item} />;
    case 'menu':
      return <MenuItem {...item} />;
  }
};

export default CanvasItemRenderer;
