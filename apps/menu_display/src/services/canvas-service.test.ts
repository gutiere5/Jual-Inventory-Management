import { beforeEach, vi, describe, it, expect } from 'vitest';
import { canvasObjectService } from './canvas-service';
import AxiosClient from '../api/axios-client';
import { z } from 'zod';

vi.mock('../api/axios-client');

const canvasObject = {
  id: 1,
  name: 'Sample Canvas',
  content: {
    items: [],
    canvasSettings: {
      width: 1920,
      height: 1080,
      backgroundColor: '#ffffff',
      showGrid: true,
      gridSize: 20,
    },
  },
  createdAt: '2026-05-09T00:00:00.000Z',
  updatedAt: '2026-05-09T00:00:00.000Z',
};

describe('getAll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getsAll returns validated canvas objects', async () => {
    vi.mocked(AxiosClient.get).mockResolvedValue({ data: [canvasObject] });
    await expect(canvasObjectService.getAll()).resolves.toEqual([canvasObject]);
  });

  it('calls the canvas endpoint exactly once', async () => {
    vi.mocked(AxiosClient.get).mockResolvedValue({ data: [canvasObject] });
    await canvasObjectService.getAll();
    expect(AxiosClient.get).toHaveBeenCalledOnce();
    expect(AxiosClient.get).toHaveBeenCalledWith('canvas');
  });

  it('returns an empty array correctly', async () => {
    vi.mocked(AxiosClient.get).mockResolvedValue({ data: [] });
    await expect(canvasObjectService.getAll()).resolves.toEqual([]);
  });

  it('throws when response data is null', async () => {
    vi.mocked(AxiosClient.get).mockResolvedValue({ data: null });
    await expect(canvasObjectService.getAll()).rejects.toBeInstanceOf(z.ZodError);
  });

  it('throws a schema validation error', async () => {
    vi.mocked(AxiosClient.get).mockResolvedValue({ data: [{ bad: 'shape' }] });
    await expect(canvasObjectService.getAll()).rejects.toBeInstanceOf(z.ZodError);
  });

  it('throws error when axios rejects', async () => {
    vi.mocked(AxiosClient.get).mockRejectedValue(new Error('Network Error'));
    await expect(canvasObjectService.getAll()).rejects.toThrow('Network Error');
  });
});

describe('getByID', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets by id and returns validated canvas objects', async () => {
    vi.mocked(AxiosClient.get).mockResolvedValue({ data: canvasObject });
    await expect(canvasObjectService.getById('1')).resolves.toEqual(canvasObject);
  });

  it('calls the canvas endpoint with id parameter exactly once', async () => {
    const id = '1';

    vi.mocked(AxiosClient.get).mockResolvedValue({ data: canvasObject });
    await canvasObjectService.getById(id);

    expect(AxiosClient.get).toHaveBeenCalledOnce();
    expect(AxiosClient.get).toHaveBeenCalledWith(`canvas/${id}`);
  });

  it('throws when response data is null', async () => {
    vi.mocked(AxiosClient.get).mockResolvedValue({ data: null });
    await expect(canvasObjectService.getById('1')).rejects.toBeInstanceOf(z.ZodError);
  });

  it('throws a schema validation error', async () => {
    vi.mocked(AxiosClient.get).mockResolvedValue({ data: { bad: 'shape' } });
    await expect(canvasObjectService.getById('1')).rejects.toBeInstanceOf(z.ZodError);
  });

  it('throws error when axios rejects', async () => {
    vi.mocked(AxiosClient.get).mockRejectedValue(new Error('Network Error'));
    await expect(canvasObjectService.getById('1')).rejects.toThrow('Network Error');
  });
});
