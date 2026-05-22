import { NavLink, useParams } from 'react-router-dom';
import { Group, Layer, Rect, Stage } from 'react-konva';
import CanvasItem from './CanvasItems';
import './CanvasDisplay.css';
import { useCanvasQuery } from '../../api/query-client';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const CanvasDisplay = () => {
  const { canvasId } = useParams<{ canvasId: string }>();
  const handle = useFullScreenHandle();

  if (!canvasId || canvasId === 'undefined')
    throw new Error('Canvas ID Is Not Defined In Canvas Display');

  const { data: canvasData } = useCanvasQuery(canvasId);

  // const baseWidth = canvasData.content.canvasSettings.width || 500;
  // const baseHeight = canvasData.content.canvasSettings.height || 500;
  const baseWidth = screen.width;
  const baseHeight = screen.height;
  const canvasBackground = canvasData.content.canvasSettings.backgroundColor || '#ffffff';

  const enterFullScreen = () => {
    void handle.enter();
  };

  return (
    <div className="canvas-display">
      <NavLink to={'/'}>
        <button>Home</button>
      </NavLink>
      <button onClick={enterFullScreen}>Full Screen</button>
      <FullScreen handle={handle}>
        <Stage width={baseWidth} height={baseHeight}>
          <Layer>
            <Group>
              <Rect
                x={0}
                y={0}
                width={baseWidth}
                height={baseHeight}
                fill={canvasBackground}
                listening={false}
              />
              {canvasData.content.items.map((item) => (
                <CanvasItem key={item.instanceId} item={item} />
              ))}
            </Group>
          </Layer>
        </Stage>
      </FullScreen>
    </div>
  );
};

export default CanvasDisplay;
