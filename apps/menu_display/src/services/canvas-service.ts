import { z } from 'zod';
import AxiosClient from '../api/axios-client';
import { CanvasObjectSchema } from '@repo/types/canvasObject.schema';
import type { CanvasObject } from '@repo/types/canvasObject.schema';

export const canvasObjectService = {
  getAll: async (): Promise<CanvasObject[]> => {
    const response = await AxiosClient.get<CanvasObject[]>('canvas');
    const parsed = z.array(CanvasObjectSchema).parse(response.data);

    return parsed;
  },

  getById: async (id: string): Promise<CanvasObject> => {
    const response = await AxiosClient.get<CanvasObject>(`canvas/${id}`);
    const parsed = CanvasObjectSchema.parse(response.data);

    return parsed;
  },
};
