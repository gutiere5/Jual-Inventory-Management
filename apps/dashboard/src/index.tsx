import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router/dom';
import ItemInventoryContainer from './routes/items/ItemInventory';
import ErrorPage from './routes/errorPage/ErrorPage';
import App from './App';
import ItemDetails from './routes/itemsDetails/item-details';
import Personnel from './routes/personnel/Personnel';
import Settings from './routes/settingsPage/Settings';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './api/query-client';
import { ExternalAppLink } from './routes/external-link';

const router = createBrowserRouter([
  {
    Component: App,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: ItemInventoryContainer,
      },
      { path: 'personnel', Component: Personnel },
      { path: 'settings', Component: Settings },
      {
        path: 'items/:itemId',
        Component: ItemDetails,
      },
      {
        path: 'canvas',
        element: <ExternalAppLink url={import.meta.env.VITE_CANVAS_EDITOR_URL as string} />,
      },
      {
        path: 'display',
        element: <ExternalAppLink url={import.meta.env.VITE_CANVAS_DISPLAY_URL as string} />,
      },
    ],
  },
]);

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element. Check index.html');

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
