import { Link } from 'react-router-dom';
import './main-menu.css';
// import { CanvasFileData } from '@repo/types/canvasItem.schema';
import { useQuery } from '@tanstack/react-query';
import { listCanvasQueryOptions } from '../../api/query-client';

function MainMenu() {
  // const canvasData: CanvasFileData[] = useLoaderData();
  const { data: canvasData, isPending, isError, error } = useQuery(listCanvasQueryOptions());

  return (
    <div className="main-menu">
      <div className="title">
        <h1>Main Menu</h1>
        <p>Choose a canvas to continue</p>
      </div>
      {isError && <p>{error.message}</p>}

      <div className="canvas-grid">
        {isPending ? (
          <p>Loading...</p>
        ) : (
          canvasData?.map((canvas) => (
            <Link to={`/canvas/${String(canvas.id)}`} key={canvas.id}>
              <button className="canvas-button">
                <h2>{canvas.name}</h2>
                <p>{canvas.createdAt}</p>
              </button>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default MainMenu;
