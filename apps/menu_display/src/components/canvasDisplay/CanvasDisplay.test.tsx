import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { useCanvasQuery } from '../../api/query-client';
import CanvasDisplay from './CanvasDisplay';
import ErrorPage from '../errorPage/error-page';
import type { CanvasObject } from '@repo/types/canvasObject.schema';
import { UseSuspenseQueryResult } from '@tanstack/react-query';
import React from 'react';
import userEvent from '@testing-library/user-event';

vi.mock('../../api/query-client', () => ({ useCanvasQuery: vi.fn() }));
vi.mock('react-konva', () => {
  type Props = React.PropsWithChildren<Record<string, unknown>>;
  return {
    Stage: (props: Props) => React.createElement('div', { 'data-testid': 'Stage' }, props.children),
    Layer: (props: Props) => React.createElement('div', { 'data-testid': 'Layer' }, props.children),
    Group: (props: Props) => React.createElement('div', { 'data-testid': 'Group' }, props.children),
    Rect: () => React.createElement('div', { 'data-testid': 'Rect' }),
  };
});

const mockCanvasData: CanvasObject = {
  id: 1,
  name: 'Sample Canvas',
  content: {
    items: [
      {
        type: 'rect',
        instanceId: 'rect-1',
        x: 10,
        y: 20,
        scaleX: 1,
        scaleY: 1,
        width: 100,
        height: 50,
        fill: '#ff0000',
        stroke: '#000000',
        strokeWidth: 2,
        cornerRadius: 4,
        dash: [],
        dashEnabled: false,
        label: 'Rect 1',
      },
    ],
    canvasSettings: {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      showGrid: false,
      gridSize: 20,
    },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Canvas Display', () => {
  const routerSetup = (overrides = {}) => {
    const props = {
      mockCanvasId: '12345',
      ...overrides,
    };
    const router = createMemoryRouter(
      [
        {
          path: '/canvas/:canvasId',
          element: <CanvasDisplay />,
          errorElement: <ErrorPage />,
        },
        {
          path: '/',
          element: <div>Home Page</div>,
        },
      ],
      { initialEntries: [`/canvas/${props.mockCanvasId}`] },
    );
    return {
      ...render(<RouterProvider router={router} />),
      props,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCanvasQuery).mockReturnValue({
      data: mockCanvasData,
    } as UseSuspenseQueryResult<CanvasObject>);
  });

  it('should get a canvasID from useParams() to useCanvasQuery()', () => {
    const { props } = routerSetup();

    expect(useCanvasQuery).toHaveBeenCalledWith(props.mockCanvasId);
  });

  it('shows error page when canvasId is missing', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const router = createMemoryRouter(
      [{ path: '/canvas', element: <CanvasDisplay />, errorElement: <ErrorPage /> }],
      { initialEntries: ['/canvas'] },
    );

    render(<RouterProvider router={router} />);

    expect(
      await screen.findByText(/Canvas ID Is Not Defined In Canvas Display/i),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should useCanvasQuery to fetch and return canvas object data', () => {
    routerSetup();

    expect(useCanvasQuery).toHaveReturnedWith({ data: mockCanvasData });
  });

  it('should render a home button', () => {
    routerSetup();

    const button = screen.getByRole('button', { name: /Home/i });

    expect(button).toBeInTheDocument();
  });

  it('should navigate home when the home button is clicked', async () => {
    const user = userEvent.setup();
    routerSetup();

    await user.click(screen.getByRole('button', { name: /Home/i }));

    expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
  });
});

it.todo('should render statge with canvassettings.width and height when full screen');
it.todo('Should make rect fill equal to canvassetting.background color and listerning to false');
it.todo(
  'should Renders one CanvasItem per canvasData.content.items with key === item.instanceId and item passed as prop.',
);
it.todo('Should return home when home button is clicked');
it.todo('Should render a full screen button');
it.todo('Check the state the screen is full screen');
it.todo('Check the state the that the screen is not full screen');
