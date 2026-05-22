import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import './error-page.css';

export default function ErrorPage() {
  const error = useRouteError() as Error;

  let errorMessage: string;
  let errorStatus: string | number | undefined;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = 'An unexpected error has occurred.';
  }

  return (
    <div className="error-page">
      <div className="error-container">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <div className="error-details">
          {errorMessage} {errorStatus && `(${String(errorStatus)})`}
        </div>

        <div className="error-actions">
          <Link to="/">
            <button className="error-home">Go back to Home</button>
          </Link>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="error-reload"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
