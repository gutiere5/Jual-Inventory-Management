import { useCanvasEditor } from '../../context/useCanvasEditor';
import { Layer, Stage, Transformer } from 'react-konva';
import { useEffect, useRef } from 'react';
import useDragAndDrop from '../../hooks/useDragAndDrop';
import BackgroundLayer from './BackgroundLayer';
import CanvasItem from './CanvasItem';
import GridLayer from './GridLayer';
import './CanvasWorkspace.css';
import { useCanvasZoom } from '../../hooks/useCanvasZoom';

const CanvasWorkspace = () => {
  const transformRef = useRef();
  const stageRef = useRef(null);
  const {
    canvasItems,
    addItem,
    updateItem,
    selectItem,
    clearSelection,
    selectedItemIds,
    canvasSettings,
    toggleGrid,
    toggleSnapToGrid,
  } = useCanvasEditor();
  const { handleDragOver, handleDrop } = useDragAndDrop(addItem, stageRef);
  const { zoom, resetZoom, handleWheel, applyZoom } = useCanvasZoom(stageRef);

  const handleBoundBox = (oldBox, newBox) => {
    if (newBox.x < 0 || newBox.y < 0) return oldBox;
    if (newBox.x + newBox.width > canvasSettings.width) return oldBox;
    if (newBox.y + newBox.height > canvasSettings.height) return oldBox;
    if (newBox.width < 5 || newBox.height < 5) return oldBox;

    return newBox;
  };

  const handleSelect = (e) => {
    if (e.target === stageRef.current) {
      clearSelection();
      return;
    }

    const node = e.target.getAttr('instanceId') ? e.target : e.target.findAncestor('Group');
    const id = node?.getAttr('instanceId');
    if (!id) return;

    const isShiftPressed = e.evt.shiftKey || e.evt.metaKey;
    const isSelected = selectedItemIds.includes(id);

    if (isShiftPressed) {
      if (isSelected) {
        selectItem(selectedItemIds.filter((itemId) => itemId !== id));
      } else {
        selectItem([...selectedItemIds, id]);
      }
    } else {
      selectItem(id);
    }
  };

  useEffect(() => {
    if (transformRef.current) {
      const nodes = selectedItemIds
        .map((id) => stageRef.current.findOne('#' + id))
        .filter((node) => node !== undefined);

      transformRef.current.nodes(nodes);
      transformRef.current.getLayer().batchDraw();
    }
  }, [selectedItemIds, canvasItems]);

  console.log(canvasItems);

  return (
    <div className="workspace">
      <div className="workspace-top">
        <button onClick={() => applyZoom(zoom - 0.1)}>-</button>
        <button onClick={resetZoom}>{Math.round(zoom * 100)}%</button>
        <button onClick={() => applyZoom(zoom + 0.1)}>+</button>

        <button onClick={() => toggleGrid()}>Grid {canvasSettings.showGrid ? 'On' : 'Off'}</button>
        <button onClick={() => toggleSnapToGrid()}>
          Snap {canvasSettings.snapToGrid ? 'On' : 'Off'}
        </button>
      </div>
      <div className="workspace-content" onDragOver={handleDragOver} onDrop={handleDrop}>
        <Stage
          width={canvasSettings.width}
          height={canvasSettings.height}
          ref={stageRef}
          onPointerDown={handleSelect}
          onWheel={handleWheel}
          draggable
        >
          <BackgroundLayer
            width={canvasSettings.width}
            height={canvasSettings.height}
            backgroundColor={canvasSettings.backgroundColor}
            backgroundImage={canvasSettings.backgroundImage}
          />
          <GridLayer
            width={canvasSettings.width}
            height={canvasSettings.height}
            visible={canvasSettings.showGrid}
          />
          <Layer>
            {canvasItems.map((item) => (
              <CanvasItem key={item.instanceId} item={item} onChange={updateItem} />
            ))}
            <Transformer
              ref={transformRef}
              keepRatio={true}
              shouldOverdrawWholeArea={true}
              boundBoxFunc={handleBoundBox}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasWorkspace;
