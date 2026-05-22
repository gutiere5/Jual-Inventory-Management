import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteCanvasDataQueryOptions, listCanvasDataQueryOptions } from '../../api/query-client';
import { useRef } from 'react';
import { useCanvasEditor } from '../../context/useCanvasEditor';

const LoadProjectModal = ({ onClose }) => {
  const { data: Canvas, isPending } = useQuery(listCanvasDataQueryOptions());
  const { mutate, isSuccess } = useMutation(deleteCanvasDataQueryOptions());
  const { loadProject } = useCanvasEditor();
  const modalRef = useRef();

  const handleLoadProject = (CanvasItem) => {
    loadProject(CanvasItem);
    onClose();
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const deleteCanvas = (id) => {
    mutate(id);
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="background-blur">
      <div className="load-modal-container">
        <h2 style={{ textAlign: 'center' }}>Load Project</h2>

        {isSuccess && <p>Project deleted successfully.</p>}

        {isPending ? (
          <p>Loading...</p>
        ) : (
          <div className="canvas-list">
            {Canvas.map((canvasItem) => (
              <div key={canvasItem.id}>
                <button
                  onClick={() => {
                    handleLoadProject(canvasItem.content);
                  }}
                >
                  {canvasItem.name}
                </button>
                <button onClick={() => deleteCanvas(canvasItem.id)}>X</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default LoadProjectModal;
