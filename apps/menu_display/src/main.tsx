import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/errorPage/error-page';
import MainMenu from './components/mainMenu/main-menu';
import canvasDisplay from './components/canvasDisplay/CanvasDisplay';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './api/query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const router = createBrowserRouter([
  {
    Component: App,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: MainMenu },
      { path: 'canvas/:canvasId', Component: canvasDisplay },
    ],
  },
]);

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element. Check index.html');

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </StrictMode>,
);
