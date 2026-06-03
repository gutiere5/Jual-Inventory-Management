import { z } from 'zod';
import AxiosClient from '../api/axios-client';
import type { Item } from '@repo/types/item.schema';
import { ItemSchema } from '@repo/types/item.schema';

export const itemService = {
  getAll: async () => {
    try {
      const response = await AxiosClient.get<{ items: Item[] }>('item');
      const parsed = z.array(ItemSchema).safeParse(response.data.items);

      if (!parsed.success) {
        const errorDetails = z.prettifyError(parsed.error);
        throw new Error(`Schema validation failed:\n${errorDetails}`);
      }

      return parsed.data;
    } catch (error: unknown) {
      throw new Error('Failed to fetch items from the service', {
        cause: error,
      });
    }
  },

  getById: async (id: string): Promise<Item> => {
    const response = await AxiosClient.get<Item>(`item/${id}`);
    const parsed = ItemSchema.parse(response.data);

    return parsed;
  },
};
